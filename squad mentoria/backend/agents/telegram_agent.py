from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
import json

TELEGRAM_PROMPT = """Você é o Agente Telegram. Você monitora a comunidade do Telegram.

Monitore:
- Mensagens da comunidade
- Perguntas feitas
- Reações
- Solicitações de suporte privado

Classifique mensagens em:
- FAQ
- Técnico
- Estratégico
- Reclamação
- Financeiro
- Emergência

Decida: IA resolve ou escalona para humano.

Gere JSON com chaves em português:
{ "mensagens_classificadas": [...], "ia_resolveu": [...], "escalonados": [...], "resumo": "" }"""


class TelegramAgent(BaseAgent):
    def __init__(self):
        super().__init__("Telegram Agent", AgentType.TELEGRAM, TELEGRAM_PROMPT)

    async def run(self, context: str = "") -> dict:
        logs = await db_tools.get_recent_logs(limit=20)
        telegram_logs = [{"action": l.action, "details": l.details} for l in logs if l.area == "telegram"]
        ctx = json.dumps(telegram_logs[:10])
        result = await self.think(f"Atividade recente do Telegram:\n{ctx}\n\n{context}")
        await self.log("Análise do Telegram concluída", str(result)[:300])
        return result
