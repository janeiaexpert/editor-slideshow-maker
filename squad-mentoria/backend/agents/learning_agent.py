from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools
import json

LEARNING_PROMPT = """Você é o Agente de Aprendizado. Você monitora a trilha de vídeos gravados.

Monitore:
- Vídeos assistidos
- Taxas de conclusão
- Exercícios realizados
- Tempo gasto por módulo
- Pontos de evasão

Detecte os módulos mais abandonados e gere sugestões de melhoria.

Gere JSON com chaves em português:
{ "analise_modulos": [...], "mais_abandonado": "", "taxa_evasao": 0, "sugestoes": [...] }"""


class LearningAgent(BaseAgent):
    def __init__(self):
        super().__init__("Learning Agent", AgentType.LEARNING, LEARNING_PROMPT)

    async def run(self, context: str = "") -> dict:
        students = await db_tools.get_all_students()
        ctx = json.dumps([{"name": s.full_name, "progress": s.learning_progress, "stage": s.current_stage} for s in students])
        result = await self.think(f"Dados dos alunos:\n{ctx}\n\n{context}")
        await self.log("Análise de aprendizado concluída", str(result)[:300])
        return result
