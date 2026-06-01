import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SlideSchema = z.object({
  kicker: z.string().describe("Rótulo curto em CAIXA ALTA, 2-4 palavras"),
  title: z.string().describe("Título impactante, pode ter quebras de linha com \\n, 4-14 palavras"),
  subtitle: z.string().describe("Frase de apoio em linguagem natural, 0-25 palavras. Pode ser vazia."),
  buttonText: z.string().describe("Texto do botão CTA. Vazio se não houver CTA neste slide."),
  buttonCaption: z.string().describe("Legenda do botão. Vazio se não houver botão."),
  align: z.enum(["top", "center", "bottom"]),
});

const CarouselSchema = z.object({
  slides: z.array(SlideSchema).length(8),
});

const InputSchema = z.object({
  insight: z.string().min(10).max(20000),
  brand: z.object({
    niche: z.string(),
    audience: z.string(),
    tone: z.string(),
    goal: z.string(),
    handle: z.string(),
    author: z.string(),
  }),
});

export const generateCarousel = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY ausente");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const system = `Você é um estrategista de conteúdo para Instagram, especialista em carrosséis de alta retenção e conversão.

REGRAS DE OURO (filtro anti-cara-de-IA):
- Linguagem natural e humana. Sem clichês motivacionais.
- Sem "imagine se", "descubra agora", "transforme sua vida", "o segredo que ninguém te conta".
- Sem emojis em excesso. Máximo 1 emoji em todo o carrossel, e só se fizer real diferença.
- Sem reticências dramáticas. Sem caps lock no corpo.
- Frases curtas, ritmo de leitura humano. Variação estrutural entre slides.
- Português brasileiro, tom condizente com o briefing.

ESTRUTURA OBRIGATÓRIA (8 slides):
1. CAPA — gancho de retenção máxima. Provoca curiosidade ou contradiz crença comum. Sem CTA.
2. CONTEXTO/PROBLEMA — nomeia a dor real do público.
3. VIRADA — quebra a forma como o leitor enxerga o tema.
4. EXPLICAÇÃO — desenvolve o argumento central, dá clareza.
5. PROVA/EXEMPLO — aterriza com exemplo concreto, dado ou caso.
6. APROFUNDAMENTO — adiciona camada que diferencia de conteúdo raso.
7. SÍNTESE — fecha a ideia, gera o "click" mental.
8. CTA — chamada coerente com o objetivo. Aqui usa buttonText + buttonCaption.

ALINHAMENTO:
- Capa (1): "center".
- CTA (8): "bottom" com botão.
- Demais: variar entre "bottom" e "center" conforme peso do texto.

CADA TÍTULO deve caber em até 4 linhas curtas. Use \\n para quebras intencionais. Nunca corte palavras.`;

    const userPrompt = `BRIEFING DA MARCA:
- Nicho: ${data.brand.niche || "não definido"}
- Público: ${data.brand.audience || "não definido"}
- Tom: ${data.brand.tone}
- Objetivo: ${data.brand.goal}
- Autor: ${data.brand.author} (${data.brand.handle})

INSIGHT BRUTO DO USUÁRIO:
"""
${data.insight}
"""

Extraia o ângulo mais forte deste insight e construa o carrossel de 8 slides seguindo a estrutura.
No slide 8 (CTA), escreva um botão curto e uma legenda de 4-7 palavras alinhada ao objetivo "${data.brand.goal}".
Nos demais slides, buttonText e buttonCaption devem ser strings vazias.`;

    const { experimental_output } = await generateText({
      model,
      system,
      prompt: userPrompt,
      experimental_output: Output.object({ schema: CarouselSchema }),
    });

    return experimental_output;
  });
