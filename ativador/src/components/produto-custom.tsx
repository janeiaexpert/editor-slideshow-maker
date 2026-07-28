"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ArrowRight, Package, Check } from "lucide-react"

const PALETTES = [
  { id: "marrom", nome: "Marrom Clássico", cores: ["#8B5E3C", "#6B4226", "#D4B896", "#F5EFE8", "#1A1A1A"] },
  { id: "azul", nome: "Azul Corporativo", cores: ["#1E40AF", "#1E3A5F", "#93C5FD", "#EFF6FF", "#0F172A"] },
  { id: "verde", nome: "Verde Natureza", cores: ["#16A34A", "#166534", "#86EFAC", "#F0FDF4", "#052E16"] },
  { id: "roxo", nome: "Roxo Criativo", cores: ["#9333EA", "#6B21A8", "#D8B4FE", "#FAF5FF", "#1E1B4B"] },
  { id: "vermelho", nome: "Vermelho Energia", cores: ["#DC2626", "#991B1B", "#FCA5A5", "#FEF2F2", "#450A0A"] },
  { id: "rosa", nome: "Rosa Elegante", cores: ["#DB2777", "#9D174D", "#F9A8D4", "#FDF2F8", "#831843"] },
  { id: "preto", nome: "Preto Premium", cores: ["#1A1A1A", "#2D2D2D", "#D4B896", "#F5EFE8", "#000000"] },
  { id: "laranja", nome: "Laranja Vibrante", cores: ["#EA580C", "#9A3412", "#FDBA74", "#FFF7ED", "#431407"] },
  { id: "ciano", nome: "Ciano Tech", cores: ["#0891B2", "#155E75", "#67E8F9", "#ECFEFF", "#083344"] },
]

const FONTS = [
  { id: "inter", nome: "Inter", estilo: "Moderno e limpo", preview: "font-[family-name:var(--font-inter)]" },
  { id: "playfair", nome: "Playfair Display", estilo: "Elegante e sofisticado", preview: "font-[family-name:var(--font-playfair)]" },
  { id: "raleway", nome: "Raleway", estilo: "Fino e profissional", preview: "font-[family-name:var(--font-raleway)]" },
  { id: "montserrat", nome: "Montserrat", estilo: "Forte e confiável", preview: "font-[family-name:var(--font-montserrat)]" },
  { id: "roboto", nome: "Roboto", estilo: "Clássico e versátil", preview: "font-[family-name:var(--font-roboto)]" },
  { id: "oswald", nome: "Oswald", estilo: "Impactante e bold", preview: "font-[family-name:var(--font-oswald)]" },
  { id: "poppins", nome: "Poppins", estilo: "Amigável e clean", preview: "font-[family-name:var(--font-poppins)]" },
  { id: "lora", nome: "Lora", estilo: "Editorial e refinado", preview: "font-[family-name:var(--font-lora)]" },
  { id: "bebas", nome: "Bebas Neue", estilo: "Alto e chamativo", preview: "font-[family-name:var(--font-bebas)]" },
]

interface ProdutoCustomProps {
  onGerar: (ideia: string, lucro: number) => void
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
    onGerar(ideia, lucro)
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#5C5146]">
        Já tem um produto pronto? Coloque as informações aqui e a ferramenta gera toda a estrutura de vendas, artefatos e automação para você.
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

          <div>
            <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider mb-2 block">
              Paleta de Cores
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PALETTES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPaleta(p.id)}
                  className={`relative rounded-lg border-2 p-2 transition-all text-left ${
                    paleta === p.id ? "border-[#8B5E3C] bg-[#FAF5F0]" : "border-[#D9CEC2] hover:border-[#A67C52]"
                  }`}
                >
                  {paleta === p.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <div className="flex gap-1 mb-1.5">
                    {p.cores.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white/50" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-[#1A1A1A] leading-tight block">{p.nome}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#D9CEC2]" />

          <div>
            <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider mb-2 block">
              Tipografia
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFonte(f.id)}
                  className={`relative rounded-lg border-2 p-2 transition-all text-left ${
                    fonte === f.id ? "border-[#8B5E3C] bg-[#FAF5F0]" : "border-[#D9CEC2] hover:border-[#A67C52]"
                  }`}
                >
                  {fonte === f.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <span className={`text-xs font-bold text-[#1A1A1A] block leading-tight ${f.preview}`}>{f.nome}</span>
                  <span className={`text-[9px] text-[#5C5146] block mt-0.5 ${f.preview}`}>{f.estilo}</span>
                </button>
              ))}
            </div>
          </div>

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
