from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
import json

SUPPORT_PROMPT = """Você é o Agente de Suporte. Você gerencia o suporte híbrido.

IA resolve:
- FAQ
- Links
- Problemas de acesso
- Ajuda de navegação

Humano resolve:
- Reembolsos
- Reclamações
- Estratégia complexa
- Casos sensíveis

Classifique cada ticket e decida: IA ou Humano.

Gere JSON com chaves em português:
{ "chamados": [...], "ia_resolveu": [...], "humano_necessario": [...], "resumo": "" }"""


class SupportAgent(BaseAgent):
    def __init__(self):
        super().__init__("Support Agent", AgentType.SUPPORT, SUPPORT_PROMPT)

    async def run(self, context: str = "") -> dict:
        bottlenecks = await db_tools.get_bottlenecks(area="support")
        ctx = json.dumps([{"title": b.title, "impact": b.impact, "status": b.status} for b in bottlenecks])
        result = await self.think(f"Tickets de suporte:\n{ctx}\n\n{context}")
        await self.log("Análise de suporte concluída", str(result)[:300])
        return result
