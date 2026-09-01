"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Package, Eye, ShoppingCart, Settings2,
  ChevronLeft, ChevronRight, Menu, X, Library, User
} from "lucide-react"

export type TabId = "produto" | "vendas" | "operacao" | "biblioteca" | "custom"

interface NavItem {
  id: TabId
  label: string
  shortLabel: string
  icon: React.ReactNode
  group: "gerar" | "organizar"
}

const NAV_ITEMS: NavItem[] = [
  { id: "produto", label: "Produto", shortLabel: "Prod.", icon: <Package className="w-4 h-4" />, group: "gerar" },
  { id: "vendas", label: "Vendas", shortLabel: "Vendas", icon: <ShoppingCart className="w-4 h-4" />, group: "gerar" },
  { id: "operacao", label: "Operação", shortLabel: "Oper.", icon: <Settings2 className="w-4 h-4" />, group: "gerar" },
  { id: "biblioteca", label: "Biblioteca", shortLabel: "Biblio.", icon: <Library className="w-4 h-4" />, group: "organizar" },
  { id: "custom", label: "Meu Produto", shortLabel: "Custom.", icon: <User className="w-4 h-4" />, group: "organizar" },
]

interface SidebarNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  newCount?: number
}

export function SidebarNav({ activeTab, onTabChange, newCount = 0 }: SidebarNavProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const gerarItems = NAV_ITEMS.filter(i => i.group === "gerar")
  const organizarItems = NAV_ITEMS.filter(i => i.group === "organizar")

  const SidebarContent = ({ isMobileDrawer = false }: { isMobileDrawer?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center ${collapsed && !isMobileDrawer ? "justify-center" : "justify-between"} px-4 py-4 border-b border-white/10`}>
        {(!collapsed || isMobileDrawer) && (
          <div className="flex items-center gap-3">
            {/* 3D Activation Button Logo */}
            <div className="relative group cursor-pointer">
              {/* Glow effect behind */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4B896] via-[#FFD700] to-[#D4B896] rounded-xl logo-glow group-hover:opacity-100 transition-all duration-500" />
              {/* Button body - 3D effect */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-[#A67C52] via-[#8B5E3C] to-[#5C3D1F] shadow-[0_4px_0_#3D2512,0_6px_12px_rgba(0,0,0,0.4)] group-hover:shadow-[0_2px_0_#3D2512,0_4px_8px_rgba(0,0,0,0.5)] group-hover:translate-y-[2px] transition-all duration-200 flex items-center justify-center">
                {/* Inner highlight */}
                <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                {/* Lightning bolt icon */}
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 drop-shadow-sm" fill="none">
                  <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" fill="#FFD700" stroke="#F5EFE8" strokeWidth="0.8" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div>
              <span className="text-sm font-bold text-white leading-none block">Ativador</span>
              <span className="text-[9px] text-[#D4B896] font-medium leading-none block mt-0.5">Crie e venda</span>
            </div>
          </div>
        )}
        {isMobileDrawer ? (
          <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/60 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors hidden md:flex"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        <div>
          {(!collapsed || isMobileDrawer) && (
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 mb-1.5 block">Gerar</span>
          )}
          <div className="space-y-0.5">
            {gerarItems.map(item => (
              <NavItemButton
                key={item.id}
                item={item}
                active={activeTab === item.id}
                collapsed={collapsed && !isMobileDrawer}
                onClick={() => {
                  onTabChange(item.id)
                  if (isMobileDrawer) setMobileOpen(false)
                }}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10 mx-2" />

        <div>
          {(!collapsed || isMobileDrawer) && (
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-3 mb-1.5 block">Organizar</span>
          )}
          <div className="space-y-0.5">
            {organizarItems.map(item => (
              <NavItemButton
                key={item.id}
                item={item}
                active={activeTab === item.id}
                collapsed={collapsed && !isMobileDrawer}
                newCount={item.id === "biblioteca" ? newCount : 0}
                onClick={() => {
                  onTabChange(item.id)
                  if (isMobileDrawer) setMobileOpen(false)
                }}
              />
            ))}
          </div>
        </div>
      </nav>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div className="fixed top-0 left-0 right-0 z-40 h-12 relative overflow-hidden flex items-center px-3 gap-3" style={{background: "linear-gradient(135deg, #6B4226 0%, #8B5E3C 40%, #A67C52 70%, #8B5E3C 100%)"}}>
          {/* Soft light glow */}
          <div className="absolute top-0 left-1/4 w-48 h-full bg-gradient-to-r from-[#D4B896]/20 via-[#FFD700]/10 to-transparent blur-2xl pointer-events-none" />
          <button
            onClick={() => setMobileOpen(true)}
            className="relative text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex items-center gap-2">
            {/* Mobile 3D Button */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4B896] via-[#FFD700] to-[#D4B896] rounded-lg logo-glow" />
              <div className="relative w-6 h-6 rounded-lg bg-gradient-to-b from-[#A67C52] via-[#8B5E3C] to-[#5C3D1F] shadow-[0_2px_0_#3D2512] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                  <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" fill="#FFD700" stroke="#F5EFE8" strokeWidth="0.8" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="text-sm font-bold text-white">Ativador</span>
          </div>
          <div className="ml-auto">
            <Badge className="bg-white text-[#8B5E3C] text-[9px] font-semibold">
              {NAV_ITEMS.find(i => i.id === activeTab)?.shortLabel}
            </Badge>
          </div>
        </div>

        {/* Mobile drawer overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64 sidebar-glass animate-slide-in-left">
              <SidebarContent isMobileDrawer />
            </div>
          </div>
        )}

        {/* Mobile bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden sidebar-glass border-t border-white/10">
          <div className="flex items-center justify-around h-14 px-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "text-[#D4B896] bg-white/10"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.id === "biblioteca" && newCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                      {newCount}
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-semibold leading-tight">{item.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 sidebar-glass border-r border-white/10 transition-all duration-300 ${
        collapsed ? "w-[60px]" : "w-[200px]"
      }`}
    >
      <SidebarContent />
    </aside>
  )
}

function NavItemButton({ item, active, collapsed, onClick, newCount = 0 }: {
  item: NavItem
  active: boolean
  collapsed: boolean
  onClick: () => void
  newCount?: number
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`w-full flex items-center gap-2.5 rounded-lg transition-all duration-200 group ${
        collapsed ? "justify-center px-0 py-2.5 mx-1" : "px-3 py-2"
      } ${
        active
          ? "bg-white/15 text-white shadow-sm"
          : "text-white/50 hover:bg-white/8 hover:text-white/80"
      }`}
    >
      <div className="relative shrink-0">
        {item.icon}
        {newCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {newCount}
          </span>
        )}
      </div>
      {!collapsed && (
        <span className="text-xs font-semibold truncate">{item.label}</span>
      )}
      {active && !collapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4B896] shrink-0" />
      )}
    </button>
  )
}
