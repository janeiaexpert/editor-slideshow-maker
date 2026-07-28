"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PRODUTOS_VALIDADOS, gerarCoverSvg } from "@/data/produtos-validados"
import { Sparkles, X, Percent, ArrowRight, ShoppingCart } from "lucide-react"
import { sanitizeSvg } from "@/lib/security"

const COMPLEMENTOS: Record<string, string[]> = {
  "chatgpt-vendas": ["automacao-marketing", "copy-ia", "chatbot-atendimento"],
  "avatares-ia": ["video-ia", "carrosseis-virais", "design-ia"],
  "carrosseis-virais": ["copy-ia", "design-ia", "trafego-ia"],
  "ia-iniciantes": ["copy-ia", "criar-gpts", "skills-ia"],
  "copy-ia": ["trafego-ia", "carrosseis-virais", "ebook-ia"],
  "video-ia": ["musica-ia", "avatares-ia", "cursos-ia"],
  "cursos-ia": ["copy-ia", "automacao-marketing", "ebook-ia"],
  "automacao-marketing": ["chatbot-atendimento", "trafego-ia", "copy-ia"],
  "design-ia": ["carrosseis-virais", "copy-ia", "video-ia"],
  "afiliados-ia": ["trafego-ia", "copy-ia", "automacao-marketing"],
  "trafego-ia": ["copy-ia", "automacao-marketing", "design-ia"],
  "musica-ia": ["video-ia", "criar-gpts", "cursos-ia"],
  "chatbot-atendimento": ["automacao-marketing", "chatgpt-vendas", "trafego-ia"],
  "ebook-ia": ["cursos-ia", "copy-ia", "design-ia"],
  "dados-ia": ["trafego-ia", "automacao-marketing", "personas-ia"],
  "personas-ia": ["copy-ia", "trafego-ia", "automacao-marketing"],
  "claude-ecossistema": ["vibe-coding", "skills-ia", "criar-gpts"],
  "vibe-coding": ["claude-ecossistema", "criar-gpts", "design-ia"],
  "skills-ia": ["claude-ecossistema", "vibe-coding", "criar-gpts"],
  "criar-gpts": ["claude-ecossistema", "skills-ia", "automacao-marketing"],
}

interface CrossSellPopupProps {
  selectedId: string
  lucro: number
  onConfirm: (ideia: string, lucro: number) => void
  onSkip: () => void
}

export function CrossSellPopup({ selectedId, lucro, onConfirm, onSkip }: CrossSellPopupProps) {
  const [selectedExtra, setSelectedExtra] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  const mainProduct = PRODUTOS_VALIDADOS.find(p => p.id === selectedId)
  const complementIds = COMPLEMENTOS[selectedId] || []
  const complementProducts = complementIds
    .map(id => PRODUTOS_VALIDADOS.find(p => p.id === id))
    .filter((p): p is typeof PRODUTOS_VALIDADOS[0] => Boolean(p))

  if (!mainProduct || complementProducts.length === 0 || dismissed) return null

  const extraProduct = selectedExtra ? PRODUTOS_VALIDADOS.find(p => p.id === selectedExtra) : null
  const extraDiscount = extraProduct ? Math.round(lucro * 0.5) : 0
  const totalWithExtra = lucro + extraDiscount

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onSkip}>
      <Card className="w-full max-w-lg border-[#D9CEC2] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8B5E3C] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1A1A1A]">Complete seu kit</h3>
                <p className="text-[10px] text-[#5C5146]">Produtos complementares que combinam com seu projeto</p>
              </div>
            </div>
            <button onClick={onSkip} className="text-[#5C5146] hover:text-[#1A1A1A]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#F5EFE8] rounded-lg p-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(mainProduct)) }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1A1A1A] truncate">{mainProduct.nome}</p>
              <p className="text-[10px] text-[#5C5146]">{mainProduct.tag}</p>
            </div>
            <p className="text-xs font-bold text-[#8B5E3C]">R$ {lucro}</p>
          </div>

          <div className="h-px bg-[#D9CEC2]" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <p className="text-xs font-bold text-[#8B5E3C]">Leve 2 e ganhe 50% off no segundo</p>
            </div>
            <p className="text-[10px] text-[#5C5146] mb-3">Quem compra <strong>{mainProduct.nome}</strong> também se beneficia de:</p>

            <div className="grid grid-cols-3 gap-2">
              {complementProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedExtra(selectedExtra === p.id ? null : p.id)}
                  className={`relative rounded-lg border-2 p-2 transition-all text-left ${
                    selectedExtra === p.id
                      ? "border-[#8B5E3C] bg-[#8B5E3C]/5"
                      : "border-transparent bg-[#F5EFE8] hover:bg-[#EDE6DC]"
                  }`}
                >
                  <div className="w-full aspect-square rounded-md overflow-hidden mb-1.5" dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(p)) }} />
                  <p className="text-[9px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{p.nome}</p>
                  <p className="text-[8px] text-[#A67C52] uppercase mt-0.5">{p.tag}</p>
                  {selectedExtra === p.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {extraProduct && (
            <div className="bg-gradient-to-r from-[#8B5E3C] to-[#6B4226] rounded-lg p-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold opacity-80">Você está levando:</p>
                  <p className="text-xs font-bold">{mainProduct.nome} + {extraProduct.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] line-through opacity-60">R$ {lucro * 2}</p>
                  <p className="text-sm font-bold">R$ {totalWithExtra}</p>
                  <p className="text-[9px] text-[#D4B896]">economize R$ {lucro - extraDiscount}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {extraProduct ? (
              <Button
                className="flex-1 bg-[#8B5E3C] hover:bg-[#6B4226] text-white"
                onClick={() => onConfirm(mainProduct.ideia, totalWithExtra)}
              >
                <ShoppingCart className="w-4 h-4" />
                Ativar Kit Completo
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="flex-1 bg-[#8B5E3C] hover:bg-[#6B4226] text-white"
                onClick={() => onConfirm(mainProduct.ideia, lucro)}
              >
                <Sparkles className="w-4 h-4" />
                Ativar Produto Principal
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          <button
            onClick={onSkip}
            className="w-full text-center text-[10px] text-[#5C5146] hover:text-[#8B5E3C] transition-colors"
          >
            Obrigado, vou ficar apenas com o produto principal
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
