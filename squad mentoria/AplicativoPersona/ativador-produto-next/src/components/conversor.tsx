"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

interface ConversorProps {
  moeda: string
  valor: number
}

const MOEDAS = [
  { cod: "USD", nome: "Dólar", flag: "🇺🇸" },
  { cod: "EUR", nome: "Euro", flag: "🇪🇺" },
  { cod: "BRL", nome: "Real", flag: "🇧🇷" },
]

export function Conversor({ moeda, valor }: ConversorProps) {
  const [taxas, setTaxas] = useState<Record<string, number> | null>(null)
  const [atualizando, setAtualizando] = useState(false)
  const [erro, setErro] = useState(false)

  const buscarTaxas = async () => {
    if (valor <= 0) return
    setAtualizando(true)
    setErro(false)
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/BRL")
      const data = await res.json()
      if (data.rates) {
        setTaxas({ USD: data.rates.USD, EUR: data.rates.EUR })
      } else {
        setErro(true)
      }
    } catch {
      setErro(true)
    } finally {
      setAtualizando(false)
    }
  }

  useEffect(() => { buscarTaxas() }, [])

  if (valor <= 0) return null

  return (
    <div className="mt-2 bg-white border border-[#D9CEC2] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">Conversor</span>
        <button
          onClick={buscarTaxas}
          disabled={atualizando}
          className="text-[10px] text-[#8B5E3C] hover:text-[#6B4226] flex items-center gap-1 disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${atualizando ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>
      <div className="space-y-1">
        {MOEDAS.filter(m => m.cod !== moeda).map(m => {
          const taxa = taxas?.[m.cod]
          const convertido = taxa ? (valor * taxa) : null
          return (
            <div key={m.cod} className="flex items-center justify-between text-xs">
              <span className="text-[#5C5146]">{m.flag} {m.nome}</span>
              <span className="font-semibold text-[#1A1A1A]">
                {convertido
                  ? m.cod === "USD"
                    ? `US$ ${convertido.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `€ ${convertido.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : erro
                    ? "Indisponível"
                    : "Carregando..."
                }
              </span>
            </div>
          )
        })}
      </div>
      {taxas && (
        <p className="text-[9px] text-[#5C5146] mt-1.5 opacity-60">
          Taxa: 1 BRL = {taxas.USD?.toFixed(4)} USD / {taxas.EUR?.toFixed(4)} EUR • {new Date().toLocaleDateString("pt-BR")}
        </p>
      )}
    </div>
  )
}
