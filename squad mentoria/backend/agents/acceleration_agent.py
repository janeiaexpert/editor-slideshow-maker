from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
import json

ACCELERATION_PROMPT = """Você é o Agente de Aceleração. Você monitora o programa de aceleração.

Monitore:
- Metas semanais
- Execução de metas
- Acompanhamento de progresso
- Resultados alcançados

Detecte alunos que estão travados e precisam de intervenção.

Gere JSON com chaves em português:
{ "alunos_travados": [...], "resumo_progresso": "", "recomendacoes": [...] }"""


class AccelerationAgent(BaseAgent):
    def __init__(self):
        super().__init__("Acceleration Agent", AgentType.ACCELERATION, ACCELERATION_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        ctx = json.dumps([{"name": s.full_name, "stage": s.current_stage, "progress": s.learning_progress, "health": s.health_score} for s in students])
        result = await self.think(f"Progresso dos alunos:\n{ctx}\n\n{context}")
        await self.log("Análise de aceleração concluída", str(result)[:300])
        return result
