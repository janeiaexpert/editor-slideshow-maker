from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
from memory.student_memory import student_memory
from datetime import datetime, timedelta

RENEWAL_PROMPT = """Você é o Agente de Renovação. Monitore renovações de contrato.

Cronograma:
- 60 dias antes: Calcule a probabilidade de renovação
- 30 dias antes: Crie plano de engajamento
- 15 dias antes: Aumente o monitoramento
- 7 dias antes: Crie tarefa de recuperação
- 3 dias antes: Notifique a equipe de vendas
- Expirado: Mova para Renovação Pendente

Gere JSON com chaves em português:
{ "expiracao_proxima": [...], "planos_engajamento": [...], "tarefas_recuperacao": [...], "alertas_vendas": [...] }"""


class RenewalAgent(BaseAgent):
    def __init__(self):
        super().__init__("Renewal Agent", AgentType.RENEWAL, RENEWAL_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        now = datetime.utcnow()
        expiring = []
        alerts = []

        for s in students:
            if not s.contract_end_date:
                continue
            days_left = (s.contract_end_date - now).days
            if days_left < 0:
                await db_tools.update_student(s.id, {"status": "renewal_pending"})
                continue

            await student_memory.calculate_renewal_probability(s.id)

            if days_left <= 7:
                await self.create_task(
                    f"URGENTE: {s.full_name} expirando em {days_left} dias",
                    f"Recuperação de alta prioridade necessária para {s.full_name}",
                    priority=10, student_id=s.id,
                )
                alerts.append({"student": s.full_name, "days_left": days_left, "priority": "critical"})
            elif days_left <= 15:
                await self.create_task(
                    f"Recuperar: {s.full_name} expirando em breve",
                    f"Aumentar monitoramento para {s.full_name}",
                    priority=8, student_id=s.id,
                )
                alerts.append({"student": s.full_name, "days_left": days_left, "priority": "high"})
            elif days_left <= 30:
                await self.create_task(
                    f"Engajar: {s.full_name} expirando em {days_left} dias",
                    f"Criar plano de engajamento para {s.full_name}",
                    priority=6, student_id=s.id,
                )
            elif days_left <= 60:
                prob = await student_memory.calculate_renewal_probability(s.id)
                expiring.append({"student": s.full_name, "days_left": days_left, "renewal_probability": prob})

        return {"expiring_soon": expiring, "alerts": alerts}
