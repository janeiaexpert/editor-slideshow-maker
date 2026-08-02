"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Store, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

const VITRINE = [
  { id:"v1", name:"ChatGPT para Negócios", tag:"IA", idea:"Quero criar um treinamento completo sobre como usar ChatGPT e IAs generativas para automatizar vendas, criar conteúdo e otimizar processos em pequenos negócios. Método validado com casos reais." },
  { id:"v2", name:"Avatares com IA", tag:"IA", idea:"Quero ensinar criadores a gerar avatares digitais realistas com IA generativa para usar em vídeos, marketing e vendas sem precisar gravar. Do prompt ao vídeo finalizado." },
  { id:"v3", name:"Artefatos Virais com IA", tag:"IA", idea:"Quero criar um método para produzir carrosséis, reels e posts virais usando inteligência artificial do roteiro ao design. Foco em engajamento real no Instagram e TikTok." },
  { id:"v4", name:"Automação de Vendas com IA", tag:"IA", idea:"Quero ensinar empreendedores a montar um sistema de vendas automatizado com IA: chatbot, nutrição, recuperação de carrinho e follow-up sem toque manual." },
  { id:"v5", name:"Cursos com IA", tag:"IA", idea:"Quero criar um guia prático para infoprodutores usarem IA na produção de cursos completos: roteiro, edição de vídeo, design, plataforma e lançamento." },
  { id:"v6", name:"Copywriting com IA", tag:"IA", idea:"Quero ensinar copywriters e marketers a usar IA para gerar anúncios, e-mails, páginas de vendas e scripts de VSL com alta conversão. Prompt engineering para copy." },
  { id:"v7", name:"Marketing de Afiliados com IA", tag:"IA", idea:"Quero criar um método para afiliados usarem IA na criação de conteúdo, análise de produtos, anúncios e automação de vendas. Do zero aos primeiros resultados." },
  { id:"v8", name:"Produção de Vídeo com IA", tag:"IA", idea:"Quero ensinar criadores a produzir vídeos completos com IA: roteiro, voz sintética, avatar digital e edição automatizada. Para YouTube, Instagram e TikTok." },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center p-4">
      <div className="w-full max-w-[800px] mx-auto">

        {/* Cover Card */}
        <Card className="border-[#D9CEC2] shadow-lg overflow-hidden">
          <div className="bg-[#8B5E3C] p-5 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full border-2 border-[#A67C52] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#A67C52]" />
            </div>
            <h1 className="text-white text-2xl font-extrabold tracking-tight">
              Ativador Automático<br />
              <span className="text-[#D4B896]">de Produtos Virais</span>
            </h1>
            <p className="text-white/70 text-sm mt-2 max-w-md mx-auto">
              Transforme sua ideia em um produto digital completo, pronto para vender — em minutos.
            </p>
          </div>

          <CardContent className="p-6 space-y-5">

            {/* O que é / Para que serve */}
            <div>
              <h2 className="text-[#8B5E3C] text-xs font-bold uppercase tracking-wider mb-2">O que é</h2>
              <p className="text-[#5C5146] text-sm leading-relaxed">
                Um sistema inteligente que gera automaticamente a estrutura completa de um produto digital:
                nome, headline, módulos, anúncios, VSL, página de vendas, funil de automação, precificação,
                plano de conteúdo, dashboard de operação e estratégias de escala. Tudo pronto para copiar e usar.
              </p>
            </div>

            <div>
              <h2 className="text-[#8B5E3C] text-xs font-bold uppercase tracking-wider mb-2">Para que serve</h2>
              <p className="text-[#5C5146] text-sm leading-relaxed">
                Para criadores, empreendedores e infoprodutores que querem lançar um produto digital sem depender
                de equipe criativa. Você descreve sua ideia, o sistema faz todo o resto.
              </p>
            </div>

            <div className="h-px bg-[#D9CEC2]" />

            {/* Passo a Passo */}
            <div>
              <h2 className="text-[#8B5E3C] text-xs font-bold uppercase tracking-wider mb-3">Passo a passo</h2>
              <div className="space-y-2">
                {[
                  { n:"1", t:"Conte sua ideia", d:"Descreva o conhecimento ou paixão que quer transformar em produto." },
                  { n:"2", t:"Defina o tom", d:"Escolha o estilo de comunicação que combina com seu público." },
                  { n:"3", t:"Revise e ative", d:"Confirme os dados, defina sua meta de lucro e ative o gerador completo." },
                ].map(s => (
                  <div key={s.n} className="flex items-start gap-3 bg-white border border-[#D9CEC2] rounded-lg p-3">
                    <div className="w-6 h-6 rounded-full bg-[#8B5E3C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {s.n}
                    </div>
                    <div>
                      <strong className="text-sm text-[#1A1A1A] block">{s.t}</strong>
                      <span className="text-xs text-[#5C5146]">{s.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#D9CEC2]" />

            {/* Vitrine */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Store className="w-4 h-4 text-[#A67C52]" />
                <span className="text-[#A67C52] text-xs font-bold uppercase tracking-wider">Vitrine — Produtos Validados</span>
              </div>
              <p className="text-[#5C5146] text-xs mb-3">8 produtos digitais com IA — clique para gerar a estrutura completa.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VITRINE.map(v => (
                  <div
                    key={v.id}
                    className="bg-[#EDE6DC] border border-[#D9CEC2] rounded-lg p-3 text-center cursor-pointer hover:border-[#8B5E3C] hover:bg-[#d9cec2] transition-all"
                    onClick={() => router.push("/dashboard?ideia="+encodeURIComponent(v.idea))}
                  >
                    <Badge variant="outline" className="text-[10px] text-[#8B5E3C] border-[#8B5E3C] mb-1">
                      {v.tag}
                    </Badge>
                    <span className="text-xs font-semibold text-[#1A1A1A] block leading-tight">{v.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-bold py-6 text-base shadow-lg"
              onClick={() => router.push("/dashboard")}
            >
              <Sparkles className="w-5 h-5" />
              Criar Meu Produto
              <ArrowRight className="w-5 h-5" />
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
