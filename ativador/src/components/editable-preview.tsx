"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Play, ExternalLink, ShoppingCart, Loader2 } from "lucide-react"
import { sanitizeUrl } from "@/lib/security"

type EditableData = {
  headline: Record<string, string>
  modulos: Record<string, string>
  entregaveis: Record<string, string>
  vsl: Record<string, string>
  anuncios: Record<string, string>
  oferta: Record<string, string>
  bonus: Record<string, string>
  ctaLink: string
  ctaText: string
}

export function EditablePreview({
  data,
  onConfirm,
  onCancel,
}: {
  data: EditableData
  onConfirm: (d: EditableData) => void
  onCancel: () => void
}) {
  const [d, setD] = useState<EditableData>(data)
  const [publishing, setPublishing] = useState(false)

  const update = (section: string, key: string, val: string) => {
    setD(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof EditableData] as Record<string, string>, [key]: val }
    }))
  }

  const handleConfirm = () => {
    setPublishing(true)
    onConfirm({ ...d, ctaLink: d.ctaLink && d.ctaLink !== "#" ? sanitizeUrl(d.ctaLink) : "#" })
  }

  const vsl = d.vsl as Record<string, string>

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-[#F5EFE8] w-full max-w-[800px] rounded-xl shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#8B5E3C] p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-white font-bold text-sm tracking-wider">EDITAR PREVIEW DA PÁGINA DE VENDAS</h2>
          <button onClick={onCancel} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">

          {/* HERO */}
          <Section title="HERO / HEADLINE">
            <Field label="Nome do Produto" value={d.headline["Headline"]} onChange={v => update("headline", "Headline", v)} />
            <Field label="Subtítulo" value={d.headline["Subtítulo"]} onChange={v => update("headline", "Subtítulo", v)} />
            <Field label="Benefício Central" value={d.headline["Benefício Central"]} onChange={v => update("headline", "Benefício Central", v)} />
            <Field label="Prova Social" value={d.headline["Prova Social"]} onChange={v => update("headline", "Prova Social", v)} large />
          </Section>

          {/* PROBLEM HOOKS */}
          <Section title="HOOKS / DORES">
            <Field label="Hook Topo" value={d.anuncios["Hook Topo"]} onChange={v => update("anuncios", "Hook Topo", v)} large />
            <Field label="Hook Meio" value={d.anuncios["Hook Meio"]} onChange={v => update("anuncios", "Hook Meio", v)} large />
            <Field label="Hook Fundo" value={d.anuncios["Hook Fundo"]} onChange={v => update("anuncios", "Hook Fundo", v)} large />
          </Section>

          {/* VSL */}
          <Section title="VSL — VÍDEO DE VENDAS">
            {vsl["Video"] && (
              <div className="mb-3">
                <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-1">Vídeo</span>
                <video src={vsl["Video"]} controls className="w-full rounded-lg bg-black max-h-[250px]" style={{ aspectRatio: "16/9" }} />
              </div>
            )}
            <Field label="Abertura" value={vsl["Abertura"]} onChange={v => update("vsl", "Abertura", v)} large />
            <Field label="Problema" value={vsl["Problema"]} onChange={v => update("vsl", "Problema", v)} large />
            <Field label="Solução" value={vsl["Solução"]} onChange={v => update("vsl", "Solução", v)} large />
            <Field label="Prova Social" value={vsl["Prova Social"]} onChange={v => update("vsl", "Prova Social", v)} large />
            <Field label="Oferta" value={vsl["Oferta"]} onChange={v => update("vsl", "Oferta", v)} large />
            <Field label="Script Completo" value={vsl["Script Completo"]} onChange={v => update("vsl", "Script Completo", v)} large />
          </Section>

          {/* MÓDULOS */}
          {Object.keys(d.modulos).length > 0 && (
            <Section title="MÓDULOS DO PRODUTO">
              {Object.entries(d.modulos).map(([k, v]) => (
                <Field key={k} label={k} value={v} onChange={val => update("modulos", k, val)} large />
              ))}
            </Section>
          )}

          {/* OFERTA */}
          <Section title="OFERTA / PRECIFICAÇÃO">
            <Field label="Valor Ideal" value={d.oferta["Valor Ideal"]} onChange={v => update("oferta", "Valor Ideal", v)} />
            <Field label="Ancoragem" value={d.oferta["Ancoragem"]} onChange={v => update("oferta", "Ancoragem", v)} large />
            <Field label="Parcelamento" value={d.oferta["Parcelamento"]} onChange={v => update("oferta", "Parcelamento", v)} />
            <Field label="Garantia" value={d.oferta["Garantia"]} onChange={v => update("oferta", "Garantia", v)} />
            <Field label="Escassez" value={d.oferta["Escassez"]} onChange={v => update("oferta", "Escassez", v)} large />
            <Field label="Oferta Principal" value={d.oferta["Oferta Principal"]} onChange={v => update("oferta", "Oferta Principal", v)} large />
          </Section>

          {/* BÔNUS */}
          {Object.keys(d.bonus).length > 0 && (
            <Section title="BÔNUS">
              {Object.entries(d.bonus).map(([k, v]) => (
                <Field key={k} label={k} value={v} onChange={val => update("bonus", k, val)} large />
              ))}
            </Section>
          )}

          {/* CTA LINK (seguro) */}
          <Section title="BOTÃO DE COMPRA (CTA)">
            <Field
              label="Texto do Botão"
              value={d.ctaText}
              onChange={v => setD(prev => ({ ...prev, ctaText: v }))}
            />
            <div>
              <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-1">Link do Botão</span>
              <div className="flex items-center gap-2">
                <Input
                  value={d.ctaLink}
                  onChange={e => setD(prev => ({ ...prev, ctaLink: e.target.value }))}
                  placeholder="https://suapagina.com.br/checkout"
                  className="flex-1 bg-white"
                />
                {d.ctaLink && d.ctaLink !== "#" && (
                  <a href={d.ctaLink} target="_blank" rel="noopener noreferrer" className="text-[#8B5E3C] hover:text-[#6B4226] shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-[10px] text-[#A67C52] mt-1">Apenas links https:// ou http:// são permitidos</p>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-[#F5EFE8] pb-2">
            <Button
              onClick={handleConfirm}
              disabled={publishing}
              className="flex-1 bg-[#8B5E3C] hover:bg-[#6B4226] text-white font-bold py-6"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Confirmar & Publicar Pagina de Vendas
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={publishing} className="px-6 border-[#D9CEC2] text-[#5C5146]">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#D9CEC2] rounded-lg p-4 space-y-3">
      <h3 className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, value, onChange, large }: { label: string; value: string; onChange: (v: string) => void; large?: boolean }) {
  if (large) {
    return (
      <div>
        <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-1">{label}</span>
        <Textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-[#F5EFE8] border-[#D9CEC2] text-sm min-h-[60px]"
          rows={3}
        />
      </div>
    )
  }
  return (
    <div>
      <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider block mb-1">{label}</span>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-[#F5EFE8] border-[#D9CEC2] text-sm"
      />
    </div>
  )
}
