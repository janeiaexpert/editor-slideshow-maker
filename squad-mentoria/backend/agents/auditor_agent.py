from agents.base_agent import BaseAgent
from models import AgentType, ChurnRisk
from tools.database_tools import db_tools

AUDITOR_PROMPT = """Você é o Auditor de Gargalos. Faça referência cruzada de todas as fontes de dados.

Padrões a detectar:
- Telegram Baixo + Aprendizado Baixo + Sem Eventos + Sem Aceleração = Alto Risco de Evasão
- Sem tickets de suporte + Sem presença em eventos = Desengajado
- Muito suporte + Pouco progresso = Travado
- Tudo verde + Baixa renovação = Problema de preço

Gere um plano de recuperação automático.

Gere JSON com chaves em português:
{ "padroes": [...], "planos_recuperacao": [...], "resumo": "" }"""


class AuditorAgent(BaseAgent):
    def __init__(self):
        super().__init__("Bottleneck Auditor", AgentType.AUDITOR, AUDITOR_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        bottlenecks = await db_tools.get_bottlenecks(status="open")

        context_data = {
            "total_students": len(students),
            "open_bottlenecks": len(bottlenecks),
            "students": [
                {"name": s.full_name, "health": s.health_score, "status": s.status,
                 "churn_risk": s.churn_risk, "stage": s.current_stage}
                for s in students[:20]
            ],
        }

        result = await self.think(f"Dados para análise cruzada:\n\n{context_data}")
        await self.log("Análise cruzada de todos os dados", str(result))
        return result
