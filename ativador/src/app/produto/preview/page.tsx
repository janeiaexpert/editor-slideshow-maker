"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import { CheckCircle, ShieldCheck, Star, ArrowRight, Play, BookOpen, Gift, Tag, Zap, ChevronDown, Copy, Clock, Users, TrendingUp, Award, Lock, Sparkles } from "lucide-react"
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
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 })

  useEffect(() => {
    if (!key) { setLoading(false); return }
    fetch(`/api/publish?id=${encodeURIComponent(key)}`)
      .then(res => res.ok ? res.json() : null)
      .then(d => {
        if (d && d.steps) { setData(d); return }
        try {
          const raw = localStorage.getItem("preview_data")
          if (raw) {
            const local = JSON.parse(raw)
            if (local.id === key && local.steps) setData(local)
          }
        } catch {}
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem("preview_data")
          if (raw) {
            const local = JSON.parse(raw)
            if (local.id === key && local.steps) setData(local)
          }
        } catch {}
      })
      .finally(() => setLoading(false))
  }, [key])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 23; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#8B5E3C]/30 border-t-[#8B5E3C] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Carregando página...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-[#8B5E3C]/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-[#8B5E3C]" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Página não encontrada</h1>
          <p className="text-white/50 text-sm leading-relaxed">Esta página de vendas não está mais disponível ou foi removida.</p>
          <a href="/dashboard" className="mt-8 inline-flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#6B4226] text-white px-8 py-3.5 text-sm tracking-wider uppercase font-semibold transition-all">
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
  const funil = s.funil || {}

  const modulesList = Object.values(modulos).filter(Boolean) as string[]
  const deliverablesList = Object.values(entregaveis).filter(Boolean) as string[]

  const faqs = [
    { q: "Como funciona o acesso?", a: "Imediatamente após a confirmação do pagamento, você recebe acesso completo por e-mail e na área de membros. Tudo pronto para começar agora mesmo." },
    { q: "Tem garantia?", a: "Sim! 7 dias de garantia incondicional. Se por qualquer motivo não ficar satisfeito, devolvemos 100% do seu dinheiro. Zero risco." },
    { q: "Preciso de experiência prévia?", a: "Não. O conteúdo foi desenhado do zero para funcionar mesmo que você nunca tenha mexido com isso antes. Cada etapa é explicada passo a passo." },
    { q: "Quanto tempo leva para ver resultados?", a: "Alunos dedicados começam a ver resultados nas primeiras 2 semanas. O método foi testado com centenas de pessoas em diferentes nichos." },
  ]

  const headlineText = headline.Headline || data.name
  const subtitleText = headline.Subtítulo || `Aprenda tudo o que precisa para criar e vender seu ${data.name} com inteligência artificial.`
  const benefitText = headline["Benefício Central"] || "Resultados reais em poucos dias, sem precisar de experiência anterior."
  const socialProof = headline["Prova Social"] || ""

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5E3C]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#D4B896]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#8B5E3C]/20 border border-[#8B5E3C]/30 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#D4B896]" />
              <span className="text-xs tracking-widest uppercase text-[#D4B896]">Método Validado</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
              {headlineText}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed">{subtitleText}</p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href="#oferta" className="inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6B4226] text-white px-8 py-4 text-sm tracking-widest uppercase font-semibold transition-all rounded-lg group shadow-lg shadow-[#8B5E3C]/25">
                QUERO MEU ACESSO AGORA
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {benefitText && (
              <div className="mt-8 flex items-start gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-w-xl">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-white/70 leading-relaxed">{benefitText}</p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 lg:gap-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><Users className="w-5 h-5 text-green-600" /></div>
              <div><p className="text-lg font-bold text-neutral-900">500+</p><p className="text-[10px] tracking-widest uppercase text-neutral-400">Alunos ativos</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /></div>
              <div><p className="text-lg font-bold text-neutral-900">4.9</p><p className="text-[10px] tracking-widest uppercase text-neutral-400">Avaliação média</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-lg font-bold text-neutral-900">97%</p><p className="text-[10px] tracking-widest uppercase text-neutral-400">Taxa de aprovação</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-[#8B5E3C]" /></div>
              <div><p className="text-lg font-bold text-neutral-900">7 dias</p><p className="text-[10px] tracking-widest uppercase text-neutral-400">Garantia total</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM HOOKS */}
      {anuncios["Hook Topo"] && (
        <section className="bg-white py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-block text-xs tracking-widest uppercase text-[#8B5E3C] font-semibold mb-3">Identifique-se</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Você se identifica com alguma dessas?</h2>
            </div>
            <div className="space-y-3">
              {[anuncios["Hook Topo"], anuncios["Hook Meio"], anuncios["Hook Fundo"]].filter(Boolean).map((hook, i) => (
                <div key={i} className="flex items-start gap-4 bg-neutral-50 rounded-2xl p-5 border border-neutral-100 hover:border-[#8B5E3C]/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#8B5E3C]/10 text-[#8B5E3C] flex items-center justify-center shrink-0 font-bold text-sm">{i + 1}</div>
                  <p className="text-neutral-700 leading-relaxed text-[15px]">{hook}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-500">Se você marcou pelo menos uma dessas, continue lendo. O que vem a seguir pode mudar tudo para você.</p>
            </div>
          </div>
        </section>
      )}

      {/* VSL */}
      {(vsl["Abertura"] || vsl["Video"]) && (
        <section className="bg-neutral-950 text-white py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-block text-xs tracking-widest uppercase text-[#D4B896] font-semibold mb-3">Assista Agora</span>
              <h2 className="text-2xl sm:text-3xl font-bold">Veja como funciona por dentro</h2>
              <p className="mt-3 text-white/50 text-sm max-w-lg mx-auto">5 minutos que podem transformar seu resultado. Sem compromisso.</p>
            </div>
            {vsl["Video"] ? (
              <video
                src={vsl["Video"]}
                controls
                className="w-full rounded-2xl bg-black shadow-2xl"
                style={{ aspectRatio: "16/9" }}
              />
            ) : (
              <div className="bg-neutral-900 rounded-2xl aspect-video flex items-center justify-center border border-neutral-800 cursor-pointer hover:border-[#8B5E3C]/50 transition-colors group shadow-2xl">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#8B5E3C] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#8B5E3C]/30">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-sm text-white/50 font-medium">Clique para assistir à apresentação completa</p>
                  <p className="text-xs text-white/30 mt-1">Duração: ~5 minutos</p>
                </div>
              </div>
            )}
            {vsl["Script Completo"] && (
              <div className="mt-6 bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
                <button onClick={() => setShowFullVsl(!showFullVsl)} className="flex items-center justify-between w-full p-4 text-left hover:bg-neutral-800/50 transition-colors">
                  <span className="text-sm text-white/60">Ler roteiro completo</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showFullVsl ? "rotate-180" : ""}`} />
                </button>
                {showFullVsl && <div className="px-4 pb-4 border-t border-neutral-800 pt-4"><p className="text-sm text-white/50 leading-relaxed whitespace-pre-wrap">{vsl["Script Completo"]}</p></div>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* MODULES */}
      {modulesList.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-xs tracking-widest uppercase text-[#8B5E3C] font-semibold mb-3">Conteúdo Completo</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Tudo que você vai aprender</h2>
              <p className="mt-3 text-neutral-500 max-w-lg mx-auto">{modulesList.length} módulos práticos, do básico ao avançado. Cada etapa foi testada por centenas de alunos.</p>
            </div>
            <div className="space-y-3">
              {modulesList.map((mod, i) => (
                <div key={i} className="group flex items-start gap-4 bg-neutral-50 rounded-2xl p-5 border border-neutral-100 hover:border-[#8B5E3C]/30 hover:bg-[#F5EFE8]/30 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-[#8B5E3C] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-md shadow-[#8B5E3C]/20">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 text-[15px]">Módulo {i + 1}</h3>
                    <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{mod}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DELIVERABLES */}
      {deliverablesList.length > 0 && (
        <section className="bg-neutral-50 py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-xs tracking-widest uppercase text-[#8B5E3C] font-semibold mb-3">Materiais Inclusos</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Tudo pronto para você usar</h2>
              <p className="mt-3 text-neutral-500 max-w-lg mx-auto">Cada material foi pensado para você aplicar imediatamente, sem precisar criar nada do zero.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliverablesList.map((d, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-100 hover:border-[#8B5E3C]/30 hover:shadow-lg hover:shadow-[#8B5E3C]/5 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#8B5E3C]/10 flex items-center justify-center mb-3 group-hover:bg-[#8B5E3C]/20 transition-colors">
                    <CheckCircle className="w-5 h-5 text-[#8B5E3C]" />
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BONUS */}
      {Object.keys(bonus).length > 0 && (
        <section className="bg-gradient-to-br from-amber-50 via-white to-amber-50/50 py-14 sm:py-20 border-y border-amber-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-amber-700 font-semibold mb-3">
                <Gift className="w-4 h-4" />
                Bônus Exclusivos
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Você também leva isso de graça</h2>
              <p className="mt-3 text-neutral-500 max-w-lg mx-auto">Além do conteúdo principal, preparamos bônus que aceleram seus resultados.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {Object.entries(bonus).map(([k, v], i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-amber-200/60 hover:border-amber-300 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-amber-900 text-sm">{k}</h3>
                  </div>
                  <p className="text-sm text-amber-800/70 leading-relaxed">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OFFER */}
      <section className="bg-white py-14 sm:py-20" id="oferta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#8B5E3C] font-semibold mb-3">
              <Tag className="w-4 h-4" />
              Oferta por Tempo Limitado
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Invista agora nos seus resultados</h2>
          </div>

          {/* Timer */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-center gap-3 mb-8 max-w-sm mx-auto">
            <Clock className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700 font-semibold">Oferta expira em:</span>
            <div className="flex items-center gap-1 font-mono text-red-600 font-bold">
              <span className="bg-red-100 px-2 py-0.5 rounded text-sm">{String(timeLeft.h).padStart(2, "0")}</span>
              <span>:</span>
              <span className="bg-red-100 px-2 py-0.5 rounded text-sm">{String(timeLeft.m).padStart(2, "0")}</span>
              <span>:</span>
              <span className="bg-red-100 px-2 py-0.5 rounded text-sm">{String(timeLeft.s).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="bg-neutral-50 border-2 border-[#8B5E3C]/15 rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto relative shadow-xl shadow-neutral-200/50">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B5E3C] text-white text-[10px] tracking-widest uppercase px-5 py-1.5 rounded-full font-bold shadow-md shadow-[#8B5E3C]/20">Melhor Oferta</div>
            <div className="mt-2">
              <p className="text-neutral-400 line-through text-lg">De R$ 597,00</p>
              <div className="flex items-baseline justify-center gap-1 mt-1">
                <span className="text-neutral-500 text-lg">R$</span>
                <span className="text-5xl sm:text-6xl font-bold text-neutral-900">197</span>
                <span className="text-neutral-500 text-lg">,00</span>
              </div>
              <p className="text-neutral-500 text-sm mt-2">ou <strong>12x de R$ 19,70</strong> sem juros no cartão</p>
            </div>
            <ul className="mt-8 space-y-3 text-left max-w-xs mx-auto">
              {[
                "Acesso vitalício ao conteúdo completo",
                "Todas as atualizações futuras incluídas",
                "Certificado de conclusão reconhecido",
                "Suporte direto via grupo VIP",
                "7 dias de garantia incondicional"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                  <CheckCircle className="w-4.5 h-4.5 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href={sanitizeUrl(data.ctaLink || "#")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6B4226] text-white w-full px-8 py-4 text-sm tracking-widest uppercase font-bold transition-all rounded-xl group shadow-lg shadow-[#8B5E3C]/25 hover:shadow-xl hover:shadow-[#8B5E3C]/30">
              {data.ctaText || "QUERO MEU ACESSO AGORA"}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Lock className="w-3.5 h-3.5" />
              Pagamento 100% seguro. Compra protegida.
            </div>
          </div>

          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">Garantia Incondicional de 7 Dias</h3>
              <p className="text-sm text-green-700 mt-1 leading-relaxed">Teste o conteúdo por 7 dias. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia. Risco zero.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Perguntas Frequentes</h2>
            <p className="mt-2 text-neutral-500 text-sm">Tire suas dúvidas antes de decidir</p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-[#8B5E3C]/20 transition-colors">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex items-center justify-between w-full p-5 text-left">
                  <span className="text-sm font-semibold text-neutral-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform shrink-0 ${faqOpen === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${faqOpen === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 pb-5">
                    <p className="text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B5E3C]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">Não deixe para depois. Seus resultados começam hoje.</h2>
          <p className="mt-4 text-white/50 max-w-lg mx-auto leading-relaxed">Cada dia que passa sem agir é um dia atrasado. Junte-se a quem já está transformando seus resultados.</p>
          <a href={sanitizeUrl(data.ctaLink || "#")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2.5 bg-[#8B5E3C] hover:bg-[#6B4226] text-white px-10 py-4 text-sm tracking-widest uppercase font-bold transition-all rounded-xl group shadow-lg shadow-[#8B5E3C]/25">
            {data.ctaText || "QUERO COMEÇAR AGORA"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mt-4 text-xs text-white/30">Garantia de 7 dias. Pagamento seguro. Acesso imediato.</p>
        </div>
      </section>

      <footer className="bg-neutral-950 text-neutral-500 py-8 border-t border-neutral-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-3">
          <p>&copy; 2026 — Todos os direitos reservados. Gerado pelo Ativador Automático de Produtos Virais.</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="inline-flex items-center gap-1.5 text-[#D4B896]/60 hover:text-[#D4B896] transition-colors text-xs"
          >
            <Copy className="w-3 h-3" />
            {copied ? "Link copiado!" : "Copiar link desta página"}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/30 border-t-[#8B5E3C] rounded-full animate-spin" /></div>}>
      <PreviewInner />
    </Suspense>
  )
}
