"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { CheckCircle, ShieldCheck, Star, ArrowRight, Play, BookOpen, Gift, Tag, Zap, ChevronDown, Copy } from "lucide-react"
import { sanitizeUrl } from "@/lib/security"

type SalesData = {
  ideia: string
  tom: string
  lucro: number
  name: string
  steps: Record<string, Record<string, string>>
  ctaLink?: string
  ctaText?: string
}

function PreviewInner() {
  const searchParams = useSearchParams()
  const key = searchParams.get("key") || ""
  const [showFullVsl, setShowFullVsl] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!key) { setLoading(false); return }
    fetch(`/api/publish?id=${encodeURIComponent(key)}`)
      .then(res => res.ok ? res.json() : null)
      .then(d => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [key])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-3">Página não encontrada</h1>
          <p className="text-white/60">Esta página de vendas não está mais disponível. Volte ao dashboard e publique novamente.</p>
          <a href="/dashboard" className="mt-6 inline-block bg-[#8B5E3C] hover:bg-[#6B4226] text-white px-6 py-3 text-sm tracking-widest uppercase transition-colors">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    )
  }

  const s = data.steps
  const headline = s.headline || {}
  const modulos = s.modulos || {}
  const entregaveis = s.entregaveis || {}
  const vsl = s.vsl || {}
  const anuncios = s.anuncios || {}
  const oferta = s.oferta || {}
  const bonus = s.bonus || {}

  const modulesList = Object.values(modulos).filter(Boolean) as string[]
  const deliverablesList = Object.values(entregaveis).filter(Boolean) as string[]

  const faqs = [
    { q: "Como funciona o acesso?", a: "Imediato após a confirmação do pagamento. Você recebe tudo por email e na área de membros." },
    { q: "Tem garantia?", a: "Sim! São 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro." },
    { q: "Preciso de experiência prévia?", a: "Não. O conteúdo foi desenhado para iniciantes. Cada etapa é explicada passo a passo." },
    { q: "Quanto tempo leva para ver resultados?", a: "Depende da sua dedicação, mas alunos dedicados veem resultados já nas primeiras semanas." },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,94,60,0.15),_transparent_50%)]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs tracking-widest uppercase text-white/80">Produto Digital Validado</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
              {headline.Headline || data.name}
            </h1>
            {headline.Subtítulo && (
              <p className="mt-4 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">{headline.Subtítulo}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href="#oferta" className="inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6B4226] text-white px-8 py-4 text-sm tracking-widest uppercase font-semibold transition-all group">
                Quero Garantir Minha Vaga
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              {headline["Prova Social"] && (
                <div className="flex items-center gap-2 text-white/60 text-xs tracking-wider uppercase">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {headline["Prova Social"]}
                </div>
              )}
            </div>
            {headline["Benefício Central"] && (
              <p className="mt-6 text-sm text-white/50 max-w-lg leading-relaxed">
                <strong className="text-white/80">Você vai conseguir:</strong> {headline["Benefício Central"]}
              </p>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
            <div className="text-center"><p className="text-2xl sm:text-3xl font-bold text-neutral-900">250+</p><p className="text-xs tracking-widest uppercase text-neutral-500 mt-1">Alunos</p></div>
            <div className="text-center"><p className="text-2xl sm:text-3xl font-bold text-neutral-900">97%</p><p className="text-xs tracking-widest uppercase text-neutral-500 mt-1">Satisfação</p></div>
            <div className="text-center"><p className="text-2xl sm:text-3xl font-bold text-neutral-900">4.9</p><p className="text-xs tracking-widest uppercase text-neutral-500 mt-1">Avaliações</p></div>
            <div className="text-center"><p className="text-2xl sm:text-3xl font-bold text-neutral-900">7 Dias</p><p className="text-xs tracking-widest uppercase text-neutral-500 mt-1">Garantia</p></div>
          </div>
        </div>
      </section>

      {/* PROBLEM HOOKS */}
      {anuncios["Hook Topo"] && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-8 text-center">Você já passou por isso?</h2>
            <div className="space-y-4">
              {[anuncios["Hook Topo"], anuncios["Hook Meio"], anuncios["Hook Fundo"]].filter(Boolean).map((hook, i) => (
                <div key={i} className="flex items-start gap-4 bg-neutral-50 rounded-xl p-5 border border-neutral-200">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">{i + 1}</div>
                  <p className="text-neutral-700 leading-relaxed">{hook}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VSL */}
      {(vsl["Abertura"] || vsl["Video"]) && (
        <section className="bg-neutral-900 text-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
                <Play className="w-3.5 h-3.5 text-[#D4B896]" />
                <span className="text-xs tracking-widest uppercase text-white/80">Assista ao Vídeo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Descubra como transformar seus resultados</h2>
            </div>
            {vsl["Video"] ? (
              <video
                src={vsl["Video"]}
                controls
                className="w-full rounded-2xl bg-black"
                style={{ aspectRatio: "16/9" }}
              />
            ) : (
              <div className="bg-neutral-800 rounded-2xl aspect-video flex items-center justify-center border border-neutral-700 cursor-pointer hover:border-[#8B5E3C]/50 transition-colors group">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[#8B5E3C] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 text-white ml-0.5" />
                  </div>
                  <p className="text-sm text-white/50">Assista à apresentação completa (5 min)</p>
                </div>
              </div>
            )}
            {vsl["Script Completo"] && (
              <div className="mt-8 bg-neutral-800 rounded-xl p-5 border border-neutral-700">
                <button onClick={() => setShowFullVsl(!showFullVsl)} className="flex items-center justify-between w-full text-left">
                  <span className="text-sm font-semibold text-white/80">Ver roteiro completo</span>
                  <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${showFullVsl ? "rotate-180" : ""}`} />
                </button>
                {showFullVsl && <p className="mt-4 text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{vsl["Script Completo"]}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* MODULES */}
      {modulesList.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-[#F5EFE8] rounded-full px-4 py-1.5 mb-4">
                <BookOpen className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span className="text-xs tracking-widest uppercase text-[#8B5E3C]">Conteúdo Completo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Tudo que você vai aprender</h2>
              <p className="mt-3 text-neutral-500 max-w-lg mx-auto">{modulesList.length} módulos completos</p>
            </div>
            <div className="space-y-3">
              {modulesList.map((mod, i) => (
                <div key={i} className="flex items-start gap-4 bg-neutral-50 rounded-xl p-5 border border-neutral-200 hover:border-[#8B5E3C]/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center shrink-0 font-bold text-sm">{i + 1}</div>
                  <div><h3 className="font-semibold text-neutral-900">Módulo {i + 1}</h3><p className="text-sm text-neutral-600 mt-1 leading-relaxed">{mod}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DELIVERABLES */}
      {deliverablesList.length > 0 && (
        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 mb-4 border border-neutral-200">
                <Gift className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <span className="text-xs tracking-widest uppercase text-[#8B5E3C]">O que você leva</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Materiais completos</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliverablesList.map((d, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-neutral-200 hover:border-[#8B5E3C]/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#F5EFE8] flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5 text-[#8B5E3C]" />
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BONUS */}
      {Object.keys(bonus).length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
                <Gift className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-xs tracking-widest uppercase text-amber-700">Bônus Exclusivos</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Você leva tudo isso</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {Object.entries(bonus).map(([k, v], i) => (
                <div key={i} className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 text-sm mb-1">{k}</h3>
                  <p className="text-sm text-amber-700/80 leading-relaxed">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OFFER */}
      <section className="bg-white py-16 sm:py-20" id="oferta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-1.5 mb-4">
              <Tag className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-xs tracking-widest uppercase text-amber-700">Oferta Especial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Invista no seu futuro agora</h2>
          </div>
          <div className="bg-neutral-50 border-2 border-[#8B5E3C]/20 rounded-2xl p-8 sm:p-10 text-center max-w-lg mx-auto relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B5E3C] text-white text-xs tracking-widest uppercase px-4 py-1 rounded-full font-semibold">Melhor Oferta</div>
            <div className="mt-4">
              <p className="text-neutral-400 line-through text-lg">De R$ 597</p>
              <p className="text-4xl sm:text-5xl font-bold text-neutral-900 mt-1">R$ 197,00</p>
              <p className="text-neutral-500 text-sm mt-1">ou 12x de R$ 19,70 sem juros</p>
            </div>
            <ul className="mt-8 space-y-3 text-left">
              {["Acesso vitalício ao conteúdo", "Todas as atualizações futuras", "Certificado de conclusão", "Suporte via grupo VIP", "7 dias de garantia incondicional"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-700"><CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{item}</li>
              ))}
            </ul>
            <a href={sanitizeUrl(data.ctaLink || "#")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 bg-[#8B5E3C] hover:bg-[#6B4226] text-white w-full px-8 py-4 text-sm tracking-widest uppercase font-semibold transition-all group text-center">
              {data.ctaText || "Quero Meu Acesso Agora"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4" />
              Pagamento 100% seguro • Compra protegida
            </div>
          </div>
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4 max-w-lg mx-auto">
            <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 text-sm">Garantia Incondicional de 7 Dias</h3>
              <p className="text-xs text-green-700 mt-1 leading-relaxed">Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia. Risco zero para você.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-10">Perguntas Frequentes</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex items-center justify-between w-full p-5 text-left">
                  <span className="text-sm font-semibold text-neutral-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform shrink-0 ${faqOpen === i ? "rotate-180" : ""}`} />
                </button>
                {faqOpen === i && <div className="px-5 pb-5"><p className="text-sm text-neutral-600 leading-relaxed">{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">Não espere mais para transformar seus resultados</h2>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">Junte-se a milhares de alunos que já transformaram suas vidas. Clique abaixo e garanta sua vaga agora.</p>
          <a href={sanitizeUrl(data.ctaLink || "#")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6B4226] text-white px-10 py-4 text-sm tracking-widest uppercase font-semibold transition-all group">
            {data.ctaText || "Quero Começar Agora"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      <footer className="bg-neutral-950 text-neutral-500 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-3">
          <p>© 2026 — Todos os direitos reservados. Gerado pelo Ativador Automático de Produtos Virais.</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="inline-flex items-center gap-1.5 text-[#D4B896] hover:text-[#e8d5b8] transition-colors text-xs"
          >
            <Copy className="w-3 h-3" />
            {copied ? "Link copiado!" : "Copiar link da página"}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}>
      <PreviewInner />
    </Suspense>
  )
}
