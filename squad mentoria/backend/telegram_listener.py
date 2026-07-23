import asyncio
import json
import traceback
from telegram import Update
from telegram.ext import Application, MessageHandler, filters, CallbackContext
from config import settings
from tools.database_tools import db_tools
from groq_client import call_groq_json, call_groq
from event_bus import event_bus

CLASSIFY_PROMPT = """Você é um classificador de mensagens de uma mentoria de alto ticket.

Classifique a mensagem abaixo em UMA das categorias:
- FAQ: Pergunta frequente sobre acesso, links, horários
- TECNICO: Problema técnico de plataforma, login, vídeo
- ESTRATEGICO: Dúvida sobre estratégia de negócio, marketing, vendas
- RECLAMACAO: Insatisfação com o serviço, suporte, entrega
- FINANCEIRO: Dúvida sobre pagamento, reembolso, plano
- EMERGENCIA: Crise, urgência, problema grave
- COMUM: Mensagem geral, interação normal na comunidade

Responda APENAS com JSON: {"categoria": "FAQ", "justificativa": "..."}
Sem texto extra."""

RESPONSE_PROMPT = """Você é um assistente de uma mentoria de alto ticket americana.

A mensagem abaixo foi classificada como: {categoria}

{instrucao}

Responda de forma útil, profissional e em português brasileiro.
Se for EMERGENCIA, avise que um humano será acionado.
Se for RECLAMACAO, peça desculpas e ofereça suporte humano.
Se for FAQ, responda diretamente.
Se for TECNICO, dê instruções claras.
Se for ESTRATEGICO, dê uma resposta estratégica valiosa.

IMPORTANTE: Responda APENAS com UM JSON válido nesta estrutura exata:
{{"resposta": "sua resposta aqui", "precisa_humano": false}}
NÃO inclua markdown, NÃO inclua texto extra, NÃO use crases. Apenas o JSON puro."""

AI_CATEGORIES = {"FAQ", "TECNICO", "COMUM"}
HUMAN_CATEGORIES = {"RECLAMACAO", "FINANCEIRO", "EMERGENCIA"}


class TelegramListener:
    def __init__(self):
        self.app: Application = None
        self._running = False

    async def handle_message(self, update: Update, context: CallbackContext):
        if not update.message or not update.message.text:
            return

        user = update.effective_user
        text = update.message.text
        chat_id = update.effective_chat.id
        username = user.full_name if user else "Desconhecido"
        user_id = user.id if user else 0

        # Emit event
        await event_bus.emit("telegram_message", {
            "user_id": user_id,
            "username": username,
            "text": text,
            "chat_id": chat_id,
        })

        # Classify via Groq
        try:
            classification = await call_groq_json(CLASSIFY_PROMPT, f"Mensagem: {text}", temperature=0.1, max_tokens=150)
            categoria = classification.get("categoria", "COMUM")
        except Exception:
            categoria = "COMUM"

        # Log
        await db_tools.log_agent_action(
            "Telegram Listener", "telegram",
            f"Mensagem de {username}: {categoria}",
            f"[chat:{chat_id}] {text[:200]}",
        )

        # Decide if AI responds or escalates
        if categoria in AI_CATEGORIES:
            instrucao_map = {
                "FAQ": "Responda a pergunta frequente de forma direta e útil.",
                "TECNICO": "Dê instruções técnicas claras e passo a passo.",
                "COMUM": "Responda de forma amigável e natural.",
            }
            try:
                instrucao = instrucao_map.get(categoria, "Responda de forma útil.")
                try:
                    raw = await call_groq(
                        RESPONSE_PROMPT.format(categoria=categoria, instrucao=instrucao),
                        f"Mensagem: {text}",
                        temperature=0.3,
                        max_tokens=500,
                    )
                except Exception as e:
                    await db_tools.log_agent_action("Telegram Bot", "telegram",
                        f"Groq call error: {str(e)[:100]}", traceback.format_exc()[:500])
                    return

                resposta = raw.strip()
                import re, json
                match = re.search(r'\{[^{}]+\}', resposta)
                parsed_text = None
                if match:
                    try:
                        parsed = json.loads(match.group())
                        parsed_text = parsed.get("resposta") or parsed.get("response") or parsed.get("text")
                    except json.JSONDecodeError:
                        pass
                if parsed_text:
                    resposta = parsed_text
                else:
                    cleaned = resposta.replace("```json", "").replace("```", "").strip()
                    if not cleaned.startswith("{"):
                        resposta = cleaned
                    else:
                        resposta = ""
                if resposta:
                    try:
                        await update.message.reply_text(resposta[:500])
                    except Exception as e:
                        await db_tools.log_agent_action("Telegram Bot", "telegram",
                            f"reply_text error: {str(e)[:100]}", traceback.format_exc()[:500])
                        return
                    await db_tools.log_agent_action(
                        "Telegram Bot", "telegram",
                        f"Respondeu {username} ({categoria})",
                        resposta[:200],
                    )
                else:
                    await db_tools.log_agent_action("Telegram Bot", "telegram",
                        f"Não gerou resposta válida para {username}", raw[:200])
            except Exception as e:
                tb = traceback.format_exc()
                await db_tools.log_agent_action("Telegram Bot", "telegram",
                    f"Erro ao responder {username}: {str(e)[:100]}", tb[:500])

        elif categoria in HUMAN_CATEGORIES:
            alerta = f"🔴 {categoria} de {username}: {text[:100]}"
            # Create escalation task
            from tasks.task_engine import task_engine
            await task_engine.create_task(
                title=f"Escalar mensagem {categoria}: {username}",
                description=f"Mensagem classificada como {categoria}\n\nUsuário: {username}\nTexto: {text[:500]}",
                agent_type="telegram",
                priority=10 if categoria == "EMERGENCIA" else 7,
            )
            await db_tools.log_agent_action("Telegram Bot", "telegram", alerta, "")
            if categoria == "EMERGENCIA":
                await update.message.reply_text(
                    "🆘 Sua mensagem foi classificada como urgência. "
                    "Um humano da equipe será acionado imediatamente. "
                    "Se precisar de ajuda imediata, entre em contato pelo suporte."
                )
            else:
                await update.message.reply_text(
                    f"Sua mensagem foi recebida e classificada como **{categoria}**. "
                    "Um membro da nossa equipe vai analisar e responder em breve."
                )

    async def start(self):
        self.app = Application.builder().token(settings.telegram_bot_token).build()
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
        self._running = True

        await self.app.initialize()
        await self.app.start()
        await self.app.updater.start_polling(allowed_updates=Update.ALL_TYPES)

        await db_tools.log_agent_action("Telegram Listener", "telegram", "Bot iniciado", "")
        print("[Telegram] Bot iniciado — ouvindo mensagens...")

        # Keep running
        while self._running:
            await asyncio.sleep(1)

    async def send_message(self, chat_id: int, text: str) -> bool:
        try:
            await self.app.bot.send_message(chat_id=chat_id, text=text)
            return True
        except Exception:
            return False

    async def stop(self):
        self._running = False
        if self.app:
            await self.app.updater.stop()
            await self.app.stop()
            await self.app.shutdown()


telegram_listener = TelegramListener()
