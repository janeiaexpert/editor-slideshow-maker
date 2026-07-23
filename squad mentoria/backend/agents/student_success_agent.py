from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
from memory.student_memory import student_memory
import json

SUCCESS_PROMPT = """Você é o Agente de Sucesso do Aluno. Você garante que os alunos alcancem resultados.

Monitore:
- Satisfação geral do aluno
- Realização de metas
- Relacionamento com mentor
- Progresso em direção aos resultados

Ative quando o risco de evasão estiver alto ou o aluno estiver desengajado.

Gere JSON com chaves em português:
{ "intervencoes": [...], "plano_sucesso": "", "recomendacoes": [...] }"""


class StudentSuccessAgent(BaseAgent):
    def __init__(self):
        super().__init__("Student Success Agent", AgentType.STUDENT_SUCCESS, SUCCESS_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        at_risk = [s for s in students if s.churn_risk in ("high", "medium")]
        ctx = json.dumps([{"name": s.full_name, "risk": s.churn_risk, "health": s.health_score} for s in at_risk])
        result = await self.think(f"Alunos em risco:\n{ctx}\n\n{context}")
        await self.log("Análise de sucesso concluída", str(result)[:300])
        return result
