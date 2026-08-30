"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Store, Zap, PenTool, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PRODUTOS_VALIDADOS, gerarCoverSvg } from "@/data/produtos-validados"
import { sanitizeSvg } from "@/lib/security"

const VITRINE = PRODUTOS_VALIDADOS

export default function HomePage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUTOS_VALIDADOS[0] | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EFE8] via-[#EDE6DC] to-[#E8DFD4] flex items-start sm:items-center justify-center p-4 py-8 sm:py-4 overflow-y-auto">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(212,184,150,0.2)_0%,transparent_70%)] pointer-events-none" />
      <div className="w-full max-w-[800px] mx-auto relative">

        <Card className="border-[#D9CEC2] shadow-xl overflow-hidden">
          <div className="relative bg-gradient-to-br from-[#5C3D1F] via-[#8B5E3C] to-[#A67C52] text-center pb-8 pt-6">
            <div className="absolute top-0 left-1/4 w-72 h-full bg-gradient-to-r from-[#D4B896]/25 via-[#FFD700]/12 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -top-6 right-1/4 w-56 h-24 bg-[#D4B896]/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-20 bg-[#FFD700]/8 blur-3xl pointer-events-none" />

            <div className="relative mx-auto mb-3 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4B896] via-[#FFD700] to-[#D4B896] rounded-2xl logo-glow" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-b from-[#A67C52] via-[#8B5E3C] to-[#5C3D1F] shadow-[0_6px_0_#3D2512,0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center">
                <div className="absolute inset-1 rounded-[14px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-6.5 sm:h-6.5 md:w-7 md:h-7 drop-shadow-sm" fill="none">
                  <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" fill="#FFD700" stroke="#F5EFE8" strokeWidth="0.8" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <h1 className="relative text-white text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Ativador Automático<br />
              <span className="text-[#D4B896]">de Produtos Virais</span>
            </h1>
            <p className="relative text-white/70 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              Transforme sua ideia em um produto digital completo, pronto para vender — em minutos.
            </p>
          </div>

          <CardContent className="p-6 space-y-5">

            <div>
              <h2 className="text-[#8B5E3C] text-xs font-bold uppercase tracking-wider mb-2">O que é</h2>
              <p className="text-[#5C5146] text-sm leading-relaxed">
                Um sistema inteligente que gera automaticamente a estrutura completa de um produto digital:
                nome, headline, módulos, anúncios, VSL, página de vendas, funil de automação, precificação,
                plano de conteúdo, dashboard de operação e estratégias de escala. Tudo pronto para copiar e usar.
              </p>
            </div>

            <div className="h-px bg-[#D9CEC2]" />

            {/* Como Começar — Duas opções */}
            <div>
              <h2 className="text-[#8B5E3C] text-xs font-bold uppercase tracking-wider mb-3">Como Começar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <button
                  onClick={() => {
                    const el = document.getElementById("vitrine-section")
                    el?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="flex items-start gap-3 bg-white border-2 border-[#D9CEC2] hover:border-[#8B5E3C] rounded-xl p-4 text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8B5E3C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#8B5E3C]/20 transition-colors">
                    <Store className="w-5 h-5 text-[#8B5E3C]" />
                  </div>
                  <div>
                    <strong className="text-sm text-[#1A1A1A] block">Escolher da Vitrine</strong>
                    <span className="text-xs text-[#5C5146] leading-relaxed block mt-1">
                      Produtos prontos e validados. Clique e gere toda a estrutura automaticamente.
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-start gap-3 bg-white border-2 border-[#D9CEC2] hover:border-[#8B5E3C] rounded-xl p-4 text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8B5E3C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#8B5E3C]/20 transition-colors">
                    <PenTool className="w-5 h-5 text-[#8B5E3C]" />
                  </div>
                  <div>
                    <strong className="text-sm text-[#1A1A1A] block">Criar do Zero</strong>
                    <span className="text-xs text-[#5C5146] leading-relaxed block mt-1">
                      Descreva sua própria ideia e o sistema gera tudo para você.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="h-px bg-[#D9CEC2]" />

            {/* O que você recebe */}
            <div>
              <h2 className="text-[#8B5E3C] text-xs font-bold uppercase tracking-wider mb-3">O que você recebe</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Headline e Promessa",
                  "5 Módulos Completos",
                  "Script de VSL",
                  "Anúncios por Plataforma",
                  "Plano de 30 Dias",
                  "Oferta e Precificação",
                  "Funil de Automação",
                  "Dashboard de KPIs",
                  "Estratégias de Escala",
                  "Página de Vendas HTML",
                  "Logo e Capas SVG",
                  "Certificado"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-[#5C5146]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#D9CEC2]" />

            {/* Vitrine */}
            <div id="vitrine-section">
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-[#A67C52]" />
                <span className="text-[#A67C52] text-xs font-bold uppercase tracking-wider">Vitrine — Produtos Prontos</span>
              </div>
              <p className="text-[#5C5146] text-xs mb-3">Clique em um produto para gerar toda a estrutura automaticamente.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {VITRINE.map(v => (
                  <div
                    key={v.id}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedProduct(v)}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-[#D4B896]/40 to-[#8B5E3C]/30 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative backdrop-blur-md bg-white/50 border border-white/40 rounded-xl overflow-hidden hover:bg-white/70 hover:border-[#8B5E3C]/40 transition-all active:scale-[0.98]">
                      <div className="aspect-[4/5] overflow-hidden" dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(v)) }} />
                      <div className="p-2 text-center">
                        <Badge variant="outline" className="text-[9px] text-[#8B5E3C] border-[#8B5E3C]/50 mb-1 bg-white/50">
                          {v.tag}
                        </Badge>
                        <span className="text-[10px] sm:text-xs font-semibold text-[#1A1A1A] block leading-tight">{v.nome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Principal */}
            <div className="relative pt-2">
              <div className="absolute inset-x-0 top-2 h-12 bg-[#5C3D1F] rounded-xl blur-lg opacity-60" />
              <Button
                className="relative w-full text-white font-bold py-6 text-base rounded-xl transition-all duration-200 hover:translate-y-[2px] hover:shadow-[0_4px_0_#3D2512] active:translate-y-[4px] active:shadow-none btn-glow"
                style={{background: "linear-gradient(180deg, #A67C52 0%, #8B5E3C 50%, #6B4226 100%)", boxShadow: "0 8px 0 #3D2512, 0 10px 24px rgba(0,0,0,0.3)"}}
                onClick={() => router.push("/dashboard")}
              >
                <Zap className="w-5 h-5" />
                Criar Meu Produto
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-center text-[10px] text-[#5C5146] mt-2">Descreva sua ideia e gere tudo em minutos</p>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Product Cover Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedProduct(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10 w-full sm:max-w-md max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-modal-in flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex justify-end p-3 bg-white/80 backdrop-blur-sm border-b border-[#D9CEC2]/50">
              <button onClick={() => setSelectedProduct(null)} className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="relative px-4 pt-2 sm:px-6 sm:pt-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4B896]/30 via-[#8B5E3C]/20 to-[#A67C52]/30 rounded-2xl blur-xl opacity-0 animate-glow-in" style={{animationDelay: '100ms'}} />
                  <div className="relative rounded-2xl overflow-hidden border border-[#D9CEC2] shadow-xl bg-white [&>svg]:w-full [&>svg]:h-auto [&>svg]:block" style={{aspectRatio: '4/5'}} dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(selectedProduct)) }} />
                </div>
              </div>

              <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-3">
                <Badge variant="outline" className="text-xs text-[#8B5E3C] border-[#8B5E3C]/50 bg-white/50">
                  {selectedProduct.tag}
                </Badge>
                <h3 className="text-lg font-bold text-[#1A1A1A]">{selectedProduct.nome}</h3>
                <p className="text-sm text-[#5C5146] leading-relaxed">{selectedProduct.descricao}</p>
                <p className="text-xs text-[#8B5E3C] font-medium">Público: {selectedProduct.publico}</p>
              </div>
            </div>

            <div className="sticky bottom-0 p-4 sm:p-6 bg-white border-t border-[#D9CEC2]/50 space-y-2">
              <Button
                className="w-full text-white font-bold py-3 sm:py-4 text-sm sm:text-base rounded-xl transition-all btn-glow"
                style={{background: "linear-gradient(180deg, #A67C52 0%, #8B5E3C 50%, #6B4226 100%)", boxShadow: "0 4px 0 #3D2512, 0 8px 16px rgba(0,0,0,0.2)"}}
                onClick={(e) => {
                  e.stopPropagation()
                  sessionStorage.setItem("selectedProductId", selectedProduct.id)
                  router.push("/dashboard?auto=1")
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Usar Este Produto
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full text-[#8B5E3C] border-[#D9CEC2] hover:bg-[#8B5E3C] hover:text-white font-semibold py-2.5 text-xs sm:text-sm rounded-xl transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedProduct(null)
                  router.push("/dashboard")
                }}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Criar do Zero com Minha Própria Ideia
              </Button>
              <p className="text-center text-[10px] text-[#5C5146]">Clique fora para fechar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
