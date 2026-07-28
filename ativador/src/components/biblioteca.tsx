"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PRODUTOS_VALIDADOS, gerarCoverSvg } from "@/data/produtos-validados"
import { Sparkles, ArrowRight, X, Search } from "lucide-react"
import { sanitizeSvg } from "@/lib/security"
import { CrossSellPopup } from "@/components/cross-sell"

const TAG_GROUPS: Record<string, string[]> = {
  "Todos": [],
  "Automação & Vendas": ["AUTOMAÇÃO", "AFILIADOS", "ANÚNCIOS", "ATENDIMENTO"],
  "Criação & Conteúdo": ["CRIAÇÃO", "CONTEÚDO", "PRODUÇÃO", "ÁUDIO"],
  "Marketing & Estratégia": ["MARKETING", "DADOS"],
  "Ferramentas IA": ["ECOSSISTEMA IA", "DESENVOLVIMENTO", "HABILIDADES IA", "PERSONALIZAÇÃO", "TECNOLOGIA", "INFOPRODUTO", "DESIGN"],
}

interface BibliotecaProps {
  onSelectProduto: (ideia: string, lucro: number) => void
}

export function Biblioteca({ onSelectProduto }: BibliotecaProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [lucro, setLucro] = useState(0)
  const [gerando, setGerando] = useState(false)
  const [search, setSearch] = useState("")
  const [activeGroup, setActiveGroup] = useState("Todos")
  const [showCrossSell, setShowCrossSell] = useState(false)

  const produto = PRODUTOS_VALIDADOS.find(p => p.id === selected)

  const allTags = useMemo(() => {
    const tags = new Set(PRODUTOS_VALIDADOS.map(p => p.tag))
    return Array.from(tags).sort()
  }, [])

  const filteredProducts = useMemo(() => {
    let result = PRODUTOS_VALIDADOS

    if (activeGroup !== "Todos") {
      const allowedTags = TAG_GROUPS[activeGroup] || []
      result = result.filter(p => allowedTags.includes(p.tag))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.nome.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.publico.toLowerCase().includes(q)
      )
    }

    return result
  }, [activeGroup, search])

  const handleConfirm = () => {
    if (!produto) return
    setShowCrossSell(true)
  }

  const handleCrossSellConfirm = (ideia: string, totalLucro: number) => {
    setGerando(true)
    setShowCrossSell(false)
    onSelectProduto(ideia, totalLucro)
  }

  const handleCrossSellSkip = () => {
    if (!produto) return
    setGerando(true)
    setShowCrossSell(false)
    onSelectProduto(produto.ideia, lucro)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#5C5146]">
        Escolha um produto validado, defina quanto quer ganhar e o sistema modela tudo para voce vender.
      </p>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A67C52]" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, tag ou publico..."
          className="pl-9 text-sm"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5146] hover:text-[#1A1A1A]">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.keys(TAG_GROUPS).map(group => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeGroup === group
                ? "bg-[#8B5E3C] text-white"
                : "bg-[#F5EFE8] text-[#5C5146] hover:bg-[#EDE6DC]"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {allTags.map(tag => {
          const count = filteredProducts.filter(p => p.tag === tag).length
          if (count === 0 && activeGroup !== "Todos") return null
          return (
            <button
              key={tag}
              onClick={() => {
                setSearch(tag)
                setActiveGroup("Todos")
              }}
              className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-[#EDE6DC] text-[#8B5E3C] hover:bg-[#D4B896] transition-colors"
            >
              {tag} ({count})
            </button>
          )
        })}
      </div>

      <div className="text-[10px] text-[#A67C52] font-medium">
        {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredProducts.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelected(p.id); setLucro(0) }}
            className="vitrine-card relative border-2 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer text-left focus:outline-none aspect-[4/5] bg-white/40"
            style={{ borderColor: selected === p.id ? "#8B5E3C" : "rgba(255,255,255,0.3)" }}
          >
            <div dangerouslySetInnerHTML={{ __html: sanitizeSvg(gerarCoverSvg(p)) }} className="w-full h-full [&>svg]:w-full [&>svg]:h-full" />
            {selected === p.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8B5E3C] flex items-center justify-center shadow-lg">
                <span className="text-white text-[10px] font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-[#5C5146]">Nenhum produto encontrado</p>
          <button onClick={() => { setSearch(""); setActiveGroup("Todos") }} className="text-xs text-[#8B5E3C] underline mt-1">
            Limpar filtros
          </button>
        </div>
      )}

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

      {showCrossSell && selected && (
        <CrossSellPopup
          selectedId={selected}
          lucro={lucro}
          onConfirm={handleCrossSellConfirm}
          onSkip={handleCrossSellSkip}
        />
      )}
    </div>
  )
}
