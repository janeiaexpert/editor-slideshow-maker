import { jsPDF } from "jspdf"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx"
import { sanitizeSvg } from "./security"

function svgToBlob(svg: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image()
    const encoded = encodeURIComponent(svg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22")
    img.src = "data:image/svg+xml;charset=utf-8," + encoded
    img.onload = () => {
      const match = svg.match(/viewBox=["']([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)["']/)
      const w = match ? Math.round(Number(match[3])) : 800
      const h = match ? Math.round(Number(match[4])) : 600
      const scale = 2
      const canvas = document.createElement("canvas")
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext("2d")
      if (!ctx) { resolve(null); return }
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(resolve, "image/png")
    }
    img.onerror = () => resolve(null)
  })
}

export async function exportPNG(title: string, content: Record<string, string>): Promise<void> {
  for (const [key, svg] of Object.entries(content)) {
    if (svg.startsWith("<svg")) {
      const blob = await svgToBlob(sanitizeSvg(svg))
      if (!blob) continue
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}-${key.toLowerCase().replace(/\s+/g, "-")}.png`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}

export function exportMarkdown(title: string, content: Record<string, string>): string {
  let md = `# ${title}\n\n`
  for (const [key, value] of Object.entries(content)) {
    md += `## ${key}\n\n${value}\n\n---\n\n`
  }
  return md
}

export function downloadMarkdown(title: string, content: Record<string, string>): void {
  const md = exportMarkdown(title, content)
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.md`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportPDF(title: string, content: Record<string, string>): void {
  const doc = new jsPDF({ format: "a4", unit: "mm" })
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  doc.setFontSize(18)
  doc.text(title, pageWidth / 2, y, { align: "center" })
  y += 12

  for (const [key, value] of Object.entries(content)) {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")
    doc.text(key, 14, y)
    y += 7
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)

    const lines = doc.splitTextToSize(value, 180)
    for (const line of lines) {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, 14, y)
      y += 5
    }
    y += 6
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`)
}

export async function exportDOCX(title: string, content: Record<string, string>): Promise<void> {
  const children: (Paragraph | Table)[] = []

  children.push(
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: 24 })],
      spacing: { after: 300 },
    })
  )

  for (const [key, value] of Object.entries(content)) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: key, bold: true, size: 16 })],
        spacing: { before: 200, after: 100 },
        heading: HeadingLevel.HEADING_2,
      })
    )
    children.push(
      new Paragraph({
        children: [new TextRun({ text: value, size: 11 })],
        spacing: { after: 200 },
      })
    )
  }

  const doc = new Document({ sections: [{ children }] })
  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
