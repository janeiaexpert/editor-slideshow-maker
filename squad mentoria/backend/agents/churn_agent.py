from agents.base_agent import BaseAgent
from models import AgentType, ChurnRisk
from tools.database_tools import db_tools
from memory.student_memory import student_memory

CHURN_PROMPT = """Você é o Agente de Risco de Evasão. Calcule a probabilidade de evasão para cada aluno.

Variáveis:
- Dias de inatividade
- Ausência em eventos
- Inatividade no Telegram
- Nenhum progresso em aulas
- Solicitações repetidas de suporte

Classifique como: baixo, médio, alto, crítico

Gere JSON com chaves em português:
{ "analises": [...], "alunos_criticos": [...], "resumo": "" }"""


class ChurnAgent(BaseAgent):
    def __init__(self):
        super().__init__("Churn Agent", AgentType.CHURN, CHURN_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        results = []

        for s in students:
            adjustments = []
            if s.telegram_activity == 0:
                adjustments.append(-10)
            if s.learning_progress == 0:
                adjustments.append(-10)
            if s.event_attendance == 0:
                adjustments.append(-10)

            if adjustments:
                await student_memory.update_health_score(s.id, adjustments)

            risk = await student_memory.calculate_renewal_probability(s.id)
            results.append({"student": s.full_name, "health_score": s.health_score, "churn_risk": risk})

        return {"analyses": results, "summary": f"Analisados {len(students)} alunos"}
