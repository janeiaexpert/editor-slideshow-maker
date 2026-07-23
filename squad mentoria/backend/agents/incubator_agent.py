from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
from datetime import datetime, timedelta

INCUBATOR_PROMPT = """Você é o Agente Incubador. Você monitora novos alunos e sua ativação.

Regras:
- Se sem atividade por 3 dias: crie tarefa de recuperação
- Se sem atividade por 7 dias: escalone para humano
- Acompanhe: primeiro login, primeira aula, primeira interação

Gere JSON com chaves em português:
{ "alunos_recuperar": [...], "escalonamentos": [...], "resumo": "" }"""


class IncubatorAgent(BaseAgent):
    def __init__(self):
        super().__init__("Incubator Agent", AgentType.INCUBATOR, INCUBATOR_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()

        recovered = []
        escalated = []

        for s in students:
            if s.learning_progress == 0 and s.telegram_activity == 0:
                days_since_entry = (datetime.utcnow() - s.entry_date).days if s.entry_date else 0
                if days_since_entry >= 7:
                    await self.create_task(
                        f"Escalar: {s.full_name} inativo por {days_since_entry} dias",
                        f"Aluno {s.full_name} não tem atividade desde a entrada. Precisa de intervenção humana.",
                        priority=10, student_id=s.id,
                    )
                    escalated.append({"student": s.full_name, "days": days_since_entry})
                    await self.log(f"Aluno inativo escalado {s.full_name}", f"{days_since_entry} dias inativo")
                elif days_since_entry >= 3:
                    await self.create_task(
                        f"Recuperar: {s.full_name}",
                        f"Aluno {s.full_name} não começou. Envie sequência de ativação.",
                        priority=7, student_id=s.id,
                    )
                    recovered.append({"student": s.full_name, "days": days_since_entry})

        result = {"alunos_recuperar": recovered, "escalonamentos": escalated}
        await self.log(f"Verificados {len(students)} alunos: {len(recovered)} recuperações, {len(escalated)} escalonamentos")
        return result
