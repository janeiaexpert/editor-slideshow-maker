from agents.base_agent import BaseAgent
from models import AgentType
from tools.database_tools import db_tools

CEO_PROMPT = """Você é o Agente CEO de uma incubadora de mentoria de alto valor.

Suas responsabilidades:
1. Ler todos os relatórios dos outros agentes
2. Detectar gargalos estratégicos em todo o negócio
3. Calcular o impacto financeiro em reais
4. Gerar resumo executivo para tomada de decisão
5. Priorizar ações com base no ROI

Você deve SEMPRE retornar apenas JSON válido, sem nenhum outro texto.
Retorne esta estrutura exata usando CHAVES EM PORTUGUÊS:
{
  "gargalos": [{"titulo": "", "descricao": "", "impacto_estimado": "R$X/mês", "recomendacao": ""}],
  "resumo_executivo": "",
  "prioridades": [{"acao": "", "motivo": "", "impacto": ""}],
  "decisoes": []
}
Se nenhum gargalo for encontrado, retorne um array gargalos vazio."""


class CEOAgent(BaseAgent):
    def __init__(self):
        super().__init__("CEO Agent", AgentType.CEO, CEO_PROMPT)

    async def run(self, context: str = "") -> dict:
        result = await self.think(f"Estado atual do ecossistema:\n\n{context}")
        await self.log("Resumo executivo gerado", str(result)[:200])

        for b in result.get("gargalos", []):
            try:
                await db_tools.save_bottleneck({
                    "title": b.get("titulo", "Gargalo desconhecido"),
                    "description": b.get("descricao", ""),
                    "area": "ceo",
                    "severity": 10,
                    "estimated_impact": b.get("impacto_estimado"),
                    "recommendation": b.get("recomendacao"),
                    "detected_by": self.name,
                })
            except Exception as e:
                await self.log(f"Error saving bottleneck: {e}")

        return result
