"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Sparkles, Download, Eye, Upload, Image, Video,
  Palette, Layout, Code, Copy, RotateCcw, Plus, X
} from "lucide-react"

type MediaItem = {
  id: string
  type: "image" | "video"
  url: string
  name: string
}

const SITE_TEMPLATES: Record<string, (prompt: string, media: MediaItem[]) => string> = {
  "landing": (prompt, media) => {
    const images = media.filter(m => m.type === "image")
    const videos = media.filter(m => m.type === "video")
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${prompt}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;color:#1A1A1A;background:#F5EFE8;line-height:1.6}
.hero{background:linear-gradient(135deg,#1A1A1A 0%,#2D2D2D 100%);color:#fff;padding:80px 24px;text-align:center}
.hero h1{font-size:clamp(28px,5vw,48px);font-weight:800;line-height:1.1;margin-bottom:16px}
.hero h1 span{color:#D4B896}
.hero p{font-size:clamp(14px,2vw,18px);color:rgba(255,255,255,0.7);margin-bottom:32px;max-width:540px;margin-left:auto;margin-right:auto}
.btn{display:inline-block;background:linear-gradient(135deg,#8B5E3C,#6B4226);color:#fff;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:2px;text-transform:uppercase;transition:all 0.2s}
.btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(139,94,60,0.4)}
.section{padding:60px 24px;max-width:800px;margin:0 auto;text-align:center}
.section h2{font-size:28px;font-weight:700;color:#8B5E3C;margin-bottom:12px}
.section p{color:#5C5146;margin-bottom:24px;font-size:16px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:32px}
.card{background:#fff;padding:24px;border-radius:12px;border:1px solid #D9CEC2;transition:all 0.2s}
.card:hover{border-color:#8B5E3C;transform:translateY(-4px)}
.card h3{font-size:18px;font-weight:700;color:#1A1A1A;margin-bottom:8px}
.card p{font-size:14px;color:#5C5146}
.cta{background:#1A1A1A;color:#fff;padding:60px 24px;text-align:center}
.cta h2{font-size:28px;font-weight:700;margin-bottom:16px}
.cta p{color:rgba(255,255,255,0.7);margin-bottom:24px}
.footer{background:#0D0D0D;color:rgba(255,255,255,0.4);padding:24px;text-align:center;font-size:12px}
.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin:32px auto;max-width:900px}
.gallery img{width:100%;border-radius:12px;aspect-ratio:16/9;object-fit:cover}
.gallery video{width:100%;border-radius:12px;aspect-ratio:16/9;object-fit:cover}
@media(max-width:640px){.hero{padding:60px 16px}.section{padding:40px 16px}.gallery{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="hero">
<h1>${prompt}</h1>
<p>Transforme seus resultados com nossa solucao completa</p>
<a href="#oferta" class="btn">QUERO COMECAR AGORA</a>
</div>
${images.length > 0 ? `
<div class="section">
<h2>Nosso Trabalho</h2>
<div class="gallery">
${images.map(img => `<img src="${img.url}" alt="${img.name}" loading="lazy"/>`).join("\n")}
</div>
</div>` : ""}
${videos.length > 0 ? `
<div class="section">
<h2>Veja em Acao</h2>
<div class="gallery">
${videos.map(vid => `<video src="${vid.url}" controls preload="metadata"></video>`).join("\n")}
</div>
</div>` : ""}
<div class="section">
<h2>Por que nos escolher?</h2>
<div class="cards">
<div class="card"><h3>Resultado Rapido</h3><p>Metodo comprovado que entrega resultados em poucos dias</p></div>
<div class="card"><h3>Suporte Total</h3><p>Equipe pronta para te ajudar em cada etapa do processo</p></div>
<div class="card"><h3>Garantia</h3><p>7 dias de garantia incondicional. Risco zero para voce</p></div>
</div>
</div>
<div class="cta" id="oferta">
<h2>Garanta Sua Vaga Agora</h2>
<p>Oferta por tempo limitado</p>
<a href="#" class="btn">QUERO MEU ACESSO</a>
</div>
<div class="footer">
<p>&copy; 2026 Todos os direitos reservados</p>
</div>
</body>
</html>`
  },
  "card": (prompt, media) => {
    const img = media.find(m => m.type === "image")
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${prompt}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#F5EFE8;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
.card{background:#fff;border-radius:16px;overflow:hidden;max-width:400px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,0.1)}
.card img{width:100%;aspect-ratio:4/5;object-fit:cover}
.card-body{padding:24px}
.badge{display:inline-block;background:#8B5E3C;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px}
.card h1{font-size:24px;font-weight:800;color:#1A1A1A;margin-bottom:8px;line-height:1.2}
.card p{font-size:14px;color:#5C5146;margin-bottom:16px}
.price{font-size:32px;font-weight:800;color:#8B5E3C}
.price span{font-size:16px;color:#999;text-decoration:line-through;margin-left:8px}
.btn{display:block;width:100%;background:linear-gradient(135deg,#8B5E3C,#6B4226);color:#fff;padding:16px;border:none;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;margin-top:16px;transition:all 0.2s}
.btn:hover{box-shadow:0 4px 16px rgba(139,94,60,0.4)}
</style>
</head>
<body>
<div class="card">
${img ? `<img src="${img.url}" alt="${prompt}"/>` : `<div style="width:100%;aspect-ratio:4/5;background:linear-gradient(135deg,#1A1A1A,#2D2D2D);display:flex;align-items:center;justify-content:center;color:#D4B896;font-size:48px;font-weight:800">V</div>`}
<div class="card-body">
<div class="badge">OFERTA ESPECIAL</div>
<h1>${prompt}</h1>
<p>Solucao completa para voce alcançar seus objetivos rapido e com garantia.</p>
<div class="price">R$ 197,00 <span>R$ 497,00</span></div>
<button class="btn">GARANTIR MINHA VAGA</button>
</div>
</div>
</body>
</html>`
  },
  "portifolio": (prompt, media) => {
    const images = media.filter(m => m.type === "image")
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${prompt}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;color:#1A1A1A;background:#F5EFE8}
nav{display:flex;justify-content:space-between;align-items:center;padding:20px 40px;max-width:1100px;margin:0 auto}
.logo{font-size:20px;font-weight:800;color:#8B5E3C}
nav ul{display:flex;gap:24px;list-style:none}
nav a{text-decoration:none;color:#5C5146;font-weight:600;font-size:14px}
nav a:hover{color:#8B5E3C}
header{text-align:center;padding:80px 24px 40px;max-width:700px;margin:0 auto}
header h1{font-size:clamp(28px,5vw,42px);font-weight:800;margin-bottom:12px}
header p{color:#5C5146;font-size:16px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;max-width:1000px;margin:0 auto;padding:0 24px 80px}
.grid-item{border-radius:12px;overflow:hidden;aspect-ratio:16/10;background:#EDE6DC;border:1px solid #D9CEC2}
.grid-item img{width:100%;height:100%;object-fit:cover}
.footer{text-align:center;padding:40px;color:#5C5146;font-size:13px;border-top:1px solid #D9CEC2}
</style>
</head>
<body>
<nav><div class="logo">${prompt}</div><ul><li><a href="#">Inicio</a></li><li><a href="#">Sobre</a></li><li><a href="#">Projetos</a></li><li><a href="#">Contato</a></li></ul></nav>
<header><h1>${prompt}</h1><p>Solucoes criativas e profissionais para destacar seu negocio</p></header>
<div class="grid">
${images.length > 0 ? images.map(img => `<div class="grid-item"><img src="${img.url}" alt="${img.name}"/></div>`).join("\n") : Array(6).fill(0).map((_, i) => `<div class="grid-item" style="display:flex;align-items:center;justify-content:center;color:#D4B896;font-size:24px;font-weight:700">${i + 1}</div>`).join("\n")}
</div>
<div class="footer">&copy; 2026 ${prompt}. Todos os direitos reservados.</div>
</body>
</html>`
  }
}

export default function GeradorSitePage() {
  const [prompt, setPrompt] = useState("")
  const [template, setTemplate] = useState<"landing" | "card" | "portifolio">("landing")
  const [html, setHtml] = useState("")
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState<MediaItem[]>([])
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const generate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error("Digite um prompt para gerar o site")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), template }),
      })
      if (res.ok) {
        const data = await res.json()
        const generated = data.html || SITE_TEMPLATES[template](prompt, media)
        setHtml(generated)
        toast.success("Site gerado com sucesso!")
      } else {
        const fallback = SITE_TEMPLATES[template](prompt, media)
        setHtml(fallback)
        toast.success("Site gerado (local)")
      }
    } catch {
      const fallback = SITE_TEMPLATES[template](prompt, media)
      setHtml(fallback)
      toast.success("Site gerado (offline)")
    } finally {
      setLoading(false)
    }
  }, [prompt, template, media])

  const handleMediaUpload = useCallback((files: FileList | null, type: "image" | "video") => {
    if (!files) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const item: MediaItem = {
          id: Date.now() + Math.random().toString(36).slice(2),
          type,
          url: reader.result as string,
          name: file.name,
        }
        setMedia(prev => [...prev, item])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const removeMedia = useCallback((id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id))
  }, [])

  const regenerate = useCallback(() => {
    if (html) {
      const updated = SITE_TEMPLATES[template](prompt, media)
      setHtml(updated)
    }
  }, [html, template, prompt, media])

  const downloadHTML = useCallback(() => {
    if (!html) return
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `site-${prompt.slice(0, 30).toLowerCase().replace(/\s+/g, "-")}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Download iniciado!")
  }, [html, prompt])

  const copyHTML = useCallback(() => {
    navigator.clipboard.writeText(html)
    toast.success("HTML copiado!")
  }, [html])

  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      <nav className="bg-white border-b border-[#D9CEC2] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#8B5E3C]" />
          <span className="font-bold text-[#1A1A1A]">Gerador de Sites</span>
        </div>
        <a href="/dashboard" className="text-sm text-[#8B5E3C] hover:underline">← Dashboard</a>
      </nav>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ height: "calc(100vh - 56px)" }}>
        {/* Painel de Controle */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-[#D9CEC2] p-4">
            <h2 className="text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> O que voce quer criar?
            </h2>
            <Input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Ex: Site de vendas para curso de IA"
              className="mb-3 text-sm"
              onKeyDown={e => e.key === "Enter" && generate()}
            />

            <div className="flex gap-2 mb-3">
              {([
                ["landing", "Landing Page", Layout],
                ["card", "Card Oferta", Layout],
                ["portifolio", "Portfolio", Layout],
              ] as const).map(([val, label, Icon]) => (
                <button
                  key={val}
                  onClick={() => setTemplate(val)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                    template === val
                      ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                      : "bg-white text-[#5C5146] border-[#D9CEC2] hover:border-[#8B5E3C]"
                  }`}
                >
                  <Icon className="w-3 h-3" /> {label}
                </button>
              ))}
            </div>

            <Button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-[#8B5E3C] hover:bg-[#6B4226] text-white"
            >
              {loading ? "Gerando..." : "Gerar Site"}
            </Button>
          </div>

          {/* Midia */}
          <div className="bg-white rounded-xl border border-[#D9CEC2] p-4">
            <h2 className="text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Image className="w-4 h-4" /> Imagens e Videos
            </h2>

            <div className="flex gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="w-3 h-3 mr-1" /> Imagem
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="w-3 h-3 mr-1" /> Video
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => handleMediaUpload(e.target.files, "image")}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={e => handleMediaUpload(e.target.files, "video")}
            />

            {media.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {media.map(m => (
                  <div key={m.id} className="relative group rounded-lg overflow-hidden border border-[#D9CEC2]">
                    {m.type === "image" ? (
                      <img src={m.url} alt={m.name} className="w-full aspect-square object-cover" />
                    ) : (
                      <video src={m.url} className="w-full aspect-square object-cover" />
                    )}
                    <button
                      onClick={() => removeMedia(m.id)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {media.length > 0 && html && (
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={regenerate}>
                <RotateCcw className="w-3 h-3 mr-1" /> Regenerar com Midia
              </Button>
            )}
          </div>

          {/* Acoes */}
          {html && (
            <div className="bg-white rounded-xl border border-[#D9CEC2] p-4">
              <h2 className="text-sm font-bold text-[#8B5E3C] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Download className="w-4 h-4" /> Exportar
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={downloadHTML}>
                  <Download className="w-3 h-3 mr-1" /> Download HTML
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={copyHTML}>
                  <Copy className="w-3 h-3 mr-1" /> Copiar Codigo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl border border-[#D9CEC2] overflow-hidden flex flex-col">
          <div className="bg-[#EDE6DC] px-4 py-2 flex items-center justify-between border-b border-[#D9CEC2]">
            <span className="text-xs font-bold text-[#8B5E3C] uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3 h-3" /> Preview
            </span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#D9CEC2]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#D4B896]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#8B5E3C]" />
            </div>
          </div>
          <div className="flex-1 relative">
            {html ? (
              <iframe
                ref={iframeRef}
                srcDoc={html}
                className="w-full h-full border-0"
                title="Preview do Site"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#5C5146] p-8">
                <Layout className="w-16 h-16 mb-4 text-[#D9CEC2]" />
                <p className="text-center text-sm">Digite um prompt e clique em <strong>Gerar Site</strong> para ver o preview aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
