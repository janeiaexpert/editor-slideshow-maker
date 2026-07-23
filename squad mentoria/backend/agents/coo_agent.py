from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
from memory.student_memory import student_memory
import json

COO_PROMPT = """Você é o Agente COO. Você monitora operações, entregas, carga de trabalho da equipe e fluxo de alunos.

Detecte:
- Atrasos operacionais
- Sobrecarga da equipe
- Falhas de processo
- Gargalos de entrega

Sempre gere saída em JSON com chaves em português:
{ "gargalos": [...], "observacoes": [...], "recomendacoes": [...] }"""


class COOAgent(BaseAgent):
    def __init__(self):
        super().__init__("COO Agent", AgentType.COO, COO_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        bottlenecks = await db_tools.get_bottlenecks()
        ctx = json.dumps({
            "students": len(students),
            "active": sum(1 for s in students if s.status == "active"),
            "bottlenecks": [{"title": b.title, "impact": b.impact} for b in bottlenecks],
        })
        result = await self.think(f"Status operacional:\n{ctx}\n\n{context}")
        await self.log("Análise operacional concluída", str(result)[:300])
        return result
