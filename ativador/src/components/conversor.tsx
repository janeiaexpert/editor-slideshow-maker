"use client"

import { useEffect, useState, useCallback } from "react"
import { RefreshCw, Clock } from "lucide-react"

interface ConversorProps {
  moeda: string
  valor: number
}

const MOEDAS = [
  { cod: "USD", nome: "Dólar", flag: "\u{1F1FA}\u{1F1F8}" },
  { cod: "EUR", nome: "Euro", flag: "\u{1F1EA}\u{1F1FA}" },
  { cod: "BRL", nome: "Real", flag: "\u{1F1E7}\u{1F1F7}" },
]

export function Conversor({ moeda, valor }: ConversorProps) {
  const [taxas, setTaxas] = useState<Record<string, number> | null>(null)
  const [atualizando, setAtualizando] = useState(false)
  const [erro, setErro] = useState(false)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>("")
  const [proximaAtualizacao, setProximaAtualizacao] = useState<string>("")

  const buscarTaxas = useCallback(async () => {
    if (valor <= 0) return
    setAtualizando(true)
    setErro(false)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)
      const res = await fetch("https://open.er-api.com/v6/latest/BRL", { signal: controller.signal })
      clearTimeout(timeout)
      const data = await res.json()
      if (data.rates) {
        setTaxas({ USD: data.rates.USD, EUR: data.rates.EUR })
        if (data.time_last_update_utc) {
          const d = new Date(data.time_last_update_utc)
          setUltimaAtualizacao(d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }))
        }
        if (data.time_next_update_utc) {
          const d = new Date(data.time_next_update_utc)
          setProximaAtualizacao(d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }))
        }
      } else {
        setTaxas({ USD: 0.19, EUR: 0.17 })
        setUltimaAtualizacao("Estimativa (API indisponível)")
      }
    } catch {
      setTaxas({ USD: 0.19, EUR: 0.17 })
      setUltimaAtualizacao("Estimativa (API indisponível)")
      setErro(true)
    } finally {
      setAtualizando(false)
    }
  }, [valor])

  useEffect(() => { buscarTaxas() }, [buscarTaxas])

  if (valor <= 0) return null

  return (
    <div className="mt-2 bg-white border border-[#D9CEC2] rounded-lg p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-[#A67C52] uppercase tracking-wider">Conversor de Moedas</span>
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
                    : `\u20AC ${convertido.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "Carregando..."
                }
              </span>
            </div>
          )
        })}
      </div>
      {taxas && (
        <div className="mt-2 pt-1.5 border-t border-[#D9CEC2]/50">
          <div className="flex items-center gap-1 text-[9px] text-[#5C5146] opacity-70">
            <Clock className="w-2.5 h-2.5" />
            <span>Atualizado: {ultimaAtualizacao}</span>
          </div>
          {proximaAtualizacao && (
            <p className="text-[9px] text-[#5C5146] opacity-50 mt-0.5">
              Próxima atualização: {proximaAtualizacao}
            </p>
          )}
          <p className="text-[9px] text-[#5C5146] opacity-50 mt-0.5">
            1 BRL = {taxas.USD?.toFixed(4)} USD / {taxas.EUR?.toFixed(4)} EUR
          </p>
        </div>
      )}
    </div>
  )
}