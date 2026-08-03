"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PRODUTOS_VALIDADOS, gerarCoverSvg } from "@/data/produtos-validados"
import { Sparkles, ArrowRight, X } from "lucide-react"
import { sanitizeSvg } from "@/lib/security"

interface BibliotecaProps {
  onSelectProduto: (ideia: string, lucro: number) => void
}

export function Biblioteca({ onSelectProduto }: BibliotecaProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [lucro, setLucro] = useState(0)
  const [gerando, setGerando] = useState(false)

  const produto = PRODUTOS_VALIDADOS.find(p => p.id === selected)

  const handleConfirm = () => {
    if (!produto) return
    setGerando(true)
    onSelectProduto(produto.ideia, lucro)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#5C5146]">
        Escolha um produto validado, defina quanto quer ganhar e o sistema modela tudo para voce vender.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PRODUTOS_VALIDADOS.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelected(p.id); setLucro(0) }}
            className="relative rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-left focus:outline-none aspect-[4/5]"
            style={{ borderColor: selected === p.id ? "#8B5E3C" : "transparent" }}
          >
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(p)) }} className="w-full h-full [&>svg]:w-full [&>svg]:h-full" />
            {selected === p.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {selected && produto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => { if (!gerando) { setSelected(null); setLucro(0) } }}>
          <Card className="w-full max-w-md border-[#D9CEC2] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(produto)) }} />
                  <div>
                    <h3 className="text-sm font-bold text-[#1A1A1A]">{produto.nome}</h3>
                    <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">{produto.tag}</span>
                  </div>
                </div>
                {!gerando && (
                  <button onClick={() => { setSelected(null); setLucro(0) }} className="text-[#5C5146] hover:text-[#1A1A1A]">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-[#5C5146] leading-relaxed">{produto.descricao}</p>
              <p className="text-[10px] text-[#A67C52] font-semibold">Para: {produto.publico}</p>

              <div className="h-px bg-[#D9CEC2]" />

              <div>
                <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
                  Quanto quer ganhar com este produto?
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5C5146] font-semibold">R$</span>
                  <Input
                    type="number"
                    value={lucro || ""}
                    onChange={e => setLucro(e.target.value === "" ? 0 : Number(e.target.value))}
                    className="pl-8"
                    placeholder="Quanto quer ganhar? (ex: 10000)"
                    onKeyDown={e => e.stopPropagation()}
                  />
                </div>
              </div>

              <Button
                className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white"
                onClick={handleConfirm}
                disabled={gerando}
              >
                {gerando ? (
                  "Gerando Produto..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Modelar Produto para Vender
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
