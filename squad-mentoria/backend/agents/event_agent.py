from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
import json

EVENT_PROMPT = """Você é o Agente de Eventos. Você monitora eventos internos.

Monitore:
- Números de inscrição
- Taxa de presença
- Tempo de permanência
- Perguntas feitas
- Acesso à replay

Detecte baixo engajamento e sugira melhorias.

Gere JSON com chaves em português:
{ "eventos": [...], "baixo_engajamento": [...], "sugestoes": [...] }"""


class EventAgent(BaseAgent):
    def __init__(self):
        super().__init__("Event Agent", AgentType.EVENT, EVENT_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        ctx = json.dumps([{"name": s.full_name, "event_attendance": s.event_attendance} for s in students])
        result = await self.think(f"Engajamento em eventos:\n{ctx}\n\n{context}")
        await self.log("Análise de eventos concluída", str(result)[:300])
        return result
