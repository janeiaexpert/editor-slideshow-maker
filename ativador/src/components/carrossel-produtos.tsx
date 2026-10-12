"use client"

import { useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ProdutoValidado } from "@/data/produtos-validados"

interface CarrosselProdutosProps {
  produtos: ProdutoValidado[]
  itemClassName: string
  renderCard: (p: ProdutoValidado) => React.ReactNode
  titulo?: string
}

// Carrossel horizontal com rolagem nativa (sem travas): dedo no celular,
// arrastar com o mouse no computador, setas nas laterais e encaixe suave.
export function CarrosselProdutos({ produtos, itemClassName, renderCard, titulo }: CarrosselProdutosProps) {
  const trilhoRef = useRef<HTMLDivElement>(null)
  const arrastoRef = useRef<{ x: number; scroll: number; pid: number } | null>(null)
  const moveuRef = useRef(false)

  // Solta a captura ANTES do clique ser despachado, para o clique chegar no card.
  const soltar = useCallback(() => {
    const st = arrastoRef.current
    const el = trilhoRef.current
    if (st && el) {
      try {
        if (el.hasPointerCapture(st.pid)) el.releasePointerCapture(st.pid)
      } catch { /* já solta */ }
    }
    arrastoRef.current = null
  }, [])

  const rolar = useCallback((dir: 1 | -1) => {
    const el = trilhoRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }, [])

  return (
    <div className="relative rounded-2xl bg-white/50 border border-white/60 shadow-sm px-3 py-3">
      <div
        ref={trilhoRef}
        aria-label={titulo || "Carrossel de produtos"}
        className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing py-1"
        style={{ scrollSnapType: "x proximity" }}
        onPointerDown={e => {
          if (e.pointerType === "mouse" && e.button !== 0) return
          const el = trilhoRef.current
          if (!el) return
          // Sem captura aqui: o clique precisa chegar no card normalmente.
          arrastoRef.current = { x: e.clientX, scroll: el.scrollLeft, pid: e.pointerId }
          moveuRef.current = false
        }}
        onPointerMove={e => {
          const st = arrastoRef.current
          const el = trilhoRef.current
          if (!st || !el) return
          const dx = e.clientX - st.x
          if (Math.abs(dx) > 6) {
            moveuRef.current = true
            // Só captura depois que virou arrasto de verdade.
            try { el.setPointerCapture(st.pid) } catch { /* sem captura */ }
          }
          if (e.pointerType === "mouse") el.scrollLeft = st.scroll - dx
        }}
        onPointerUp={() => { soltar() }}
        onPointerCancel={() => { soltar() }}
        onClickCapture={e => {
          if (moveuRef.current) {
            e.preventDefault()
            e.stopPropagation()
            moveuRef.current = false
          }
        }}
        onDragStart={e => e.preventDefault()}
      >
        {produtos.map(p => (
          <div key={p.id} className={`${itemClassName} snap-start`}>
            {renderCard(p)}
          </div>
        ))}
      </div>
      {produtos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Produtos anteriores"
            onClick={() => rolar(-1)}
            className="hidden sm:flex absolute -left-3 top-[38%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 border border-[#D9CEC2] shadow-md items-center justify-center text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Próximos produtos"
            onClick={() => rolar(1)}
            className="hidden sm:flex absolute -right-3 top-[38%] -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 border border-[#D9CEC2] shadow-md items-center justify-center text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  )
}
