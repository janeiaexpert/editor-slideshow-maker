"use client"

import { CheckCircle2, Circle, Flame } from "lucide-react"

interface StepData {
  id: string
  title: string
  tab: "produto" | "vendas" | "operacao"
  generated: boolean
}

const TAB_CONFIG = {
  produto: { label: "Produto", emoji: "📦", color: "#8B5E3C" },
  vendas: { label: "Vendas", emoji: "💰", color: "#D4A574" },
  operacao: { label: "Operação", emoji: "⚙️", color: "#6B4226" },
} as const

export function TrilhaProgresso({
  steps,
  activeTab,
  onTabClick,
}: {
  steps: StepData[]
  activeTab: string
  onTabClick: (tab: string) => void
}) {
  const tabs = ["produto", "vendas", "operacao"] as const
  const totalSteps = steps.length
  const completedSteps = steps.filter(s => s.generated).length
  const overallPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 pt-3 pb-1">
      {/* Overall progress bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#D9CEC2] p-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#8B5E3C]" />
            <span className="text-xs font-bold text-[#5C5146]">Trilha de Progresso</span>
          </div>
          <span className="text-[10px] font-semibold text-[#8B5E3C]">
            {completedSteps}/{totalSteps} passos ({overallPercent}%)
          </span>
        </div>

        {/* Overall bar */}
        <div className="w-full h-2 bg-[#EDE6DC] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#D4A574] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Per-tab mini progress */}
        <div className="grid grid-cols-3 gap-2">
          {tabs.map(tab => {
            const tabSteps = steps.filter(s => s.tab === tab)
            const tabCompleted = tabSteps.filter(s => s.generated).length
            const tabTotal = tabSteps.length
            const tabPercent = tabTotal > 0 ? Math.round((tabCompleted / tabTotal) * 100) : 0
            const isActive = activeTab === tab
            const config = TAB_CONFIG[tab]

            return (
              <button
                key={tab}
                onClick={() => onTabClick(tab)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#8B5E3C]/10 border border-[#8B5E3C]/30"
                    : "bg-white/50 border border-transparent hover:bg-white/80"
                }`}
              >
                <span className="text-xs sm:text-sm">{config.emoji}</span>
                <span className={`text-[9px] sm:text-[10px] font-bold ${isActive ? "text-[#8B5E3C]" : "text-[#5C5146]"}`}>
                  {config.label}
                </span>
                <div className="w-full h-1 bg-[#EDE6DC] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${tabPercent}%`,
                      backgroundColor: tabPercent === 100 ? "#22C55E" : config.color,
                    }}
                  />
                </div>
                <span className="text-[8px] sm:text-[9px] text-[#5C5146]">
                  {tabCompleted}/{tabTotal}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
