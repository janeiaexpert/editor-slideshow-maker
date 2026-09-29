"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight, Package } from "lucide-react"
import { PALETTES, FONTS } from "@/data/identidade"
import { IdentidadeSeletor } from "@/components/identidade-seletor"

interface ProdutoCustomProps {
  onGerar: (ideia: string, lucro: number, produtoInfo?: { nome: string; tag: string; descricao: string; publico: string; paleta?: { id: string; nome: string; cores: string[] }; fonte?: { id: string; nome: string } }) => void
}

export function ProdutoCustom({ onGerar }: ProdutoCustomProps) {
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [publico, setPublico] = useState("")
  const [instagram, setInstagram] = useState("")
  const [lucro, setLucro] = useState(0)
  const [paleta, setPaleta] = useState("marrom")
  const [fonte, setFonte] = useState("inter")
  const [gerando, setGerando] = useState(false)

  const isValid = nome.trim().length > 0 && descricao.trim().length > 0

  const handleGerar = () => {
    if (!isValid) return
    setGerando(true)
    const p = PALETTES.find(x => x.id === paleta)
    const f = FONTS.find(x => x.id === fonte)
    const cores = p ? p.cores.join(", ") : ""
    const ig = instagram.startsWith("@") ? instagram : instagram ? `@${instagram}` : ""
    const ideia = `${nome}. ${descricao}. Público-alvo: ${publico || "Não definido"}. Paleta de cores: ${cores}. Nome da paleta: ${p?.nome || "Marrom Clássico"}. Tipografia: ${f?.nome || "Inter"}. Instagram: ${ig || "Não informado"}`
    onGerar(ideia, lucro, {
      nome,
      tag: p?.nome || "Marrom Clássico",
      descricao,
      publico: publico || "Não definido",
      paleta: p ? { id: p.id, nome: p.nome, cores: p.cores } : undefined,
      fonte: f ? { id: f.id, nome: f.nome } : undefined
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#5C5146]">
        Já tem um produto pronto? Coloque as informações aqui e a ferramenta gera toda a estrutura de vendas, automação para você.
      </p>

      <Card className="border-[#D9CEC2]">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#8B5E3C] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1A1A]">Meu Produto</h3>
              <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">PERSONALIZADO</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
              Nome do Produto *
            </label>
            <Input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Curso de Fotografia com IA"
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
              Descrição / O que ensina *
            </label>
            <Textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descreva o que o produto entrega, o problema que resolve, como funciona..."
              className="mt-1.5 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
                Público-alvo
              </label>
              <Input
                value={publico}
                onChange={e => setPublico(e.target.value)}
                placeholder="Ex: Criadores de conteúdo"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
                Instagram
              </label>
              <Input
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                placeholder="@seuperfil"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="h-px bg-[#D9CEC2]" />

          <IdentidadeSeletor
            paletaId={paleta}
            fonteId={fonte}
            onPaleta={setPaleta}
            onFonte={setFonte}
            nomeExibicao={nome || "Nome do Produto"}
          />

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
                placeholder="Ex: 997"
              />
            </div>
          </div>

          <Button
            className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white"
            onClick={handleGerar}
            disabled={!isValid || gerando}
          >
            {gerando ? (
              "Gerando..."
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Tudo para Meu Produto
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
