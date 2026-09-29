"use client"

import { Check } from "lucide-react"
import { PALETTES, FONTS } from "@/data/identidade"

interface IdentidadeSeletorProps {
  paletaId: string
  fonteId: string
  onPaleta: (id: string) => void
  onFonte: (id: string) => void
  nomeExibicao?: string
}

export function IdentidadeSeletor({ paletaId, fonteId, onPaleta, onFonte, nomeExibicao }: IdentidadeSeletorProps) {
  const sel = PALETTES.find(p => p.id === paletaId)
  const fonteSel = FONTS.find(f => f.id === fonteId)
  const nome = nomeExibicao?.trim() ? nomeExibicao : "Nome do Produto"

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider mb-2 block">
          Paleta de Cores
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PALETTES.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPaleta(p.id)}
              className={`relative rounded-lg border-2 p-2 transition-all text-left ${
                paletaId === p.id ? "border-[#8B5E3C] bg-[#FAF5F0] shadow-md" : "border-[#D9CEC2] hover:border-[#A67C52]"
              }`}
            >
              {paletaId === p.id && (
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
        {sel && (
          <div className="mt-3 rounded-xl overflow-hidden border border-[#D9CEC2]">
            <div className="p-4 text-center" style={{ background: `linear-gradient(135deg, ${sel.cores[0]}, ${sel.cores[1]})` }}>
              <p className="text-white font-bold text-sm" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{nome}</p>
              <p className="text-white/70 text-[10px] mt-1">{sel.nome}</p>
            </div>
            <div className="flex">
              {sel.cores.map((c, i) => (
                <div key={i} className="flex-1 h-4" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-[#D9CEC2]" />

      <div>
        <label className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider mb-2 block">
          Tipografia
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FONTS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFonte(f.id)}
              className={`relative rounded-lg border-2 p-2 transition-all text-left ${
                fonteId === f.id ? "border-[#8B5E3C] bg-[#FAF5F0] shadow-md" : "border-[#D9CEC2] hover:border-[#A67C52]"
              }`}
            >
              {fonteId === f.id && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B5E3C] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
              <span className={`text-xs font-bold text-[#1A1A1A] block leading-tight ${f.preview}`}>{f.nome}</span>
              <span className={`text-[9px] text-[#5C5146] block mt-0.5 ${f.preview}`}>{f.estilo}</span>
            </button>
          ))}
        </div>
        {fonteSel && (
          <div className="mt-3 rounded-xl border border-[#D9CEC2] bg-white p-4 text-center">
            <p className={`text-lg font-bold text-[#1A1A1A] ${fonteSel.preview}`}>{nome}</p>
            <p className={`text-sm text-[#5C5146] mt-1 ${fonteSel.preview}`}>Subtítulo com a fonte {fonteSel.nome}</p>
          </div>
        )}
      </div>
    </div>
  )
}
