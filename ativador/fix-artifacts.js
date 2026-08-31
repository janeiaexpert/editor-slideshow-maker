const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Step 1: Add getPaletteColors function after stripEmojis
const helper = `
function getPaletteColors(p?: { id: string; nome: string; cores: string[] } | null) {
  const defaults = { primary: "#8B5E3C", secondary: "#6B4226", light: "#D4B896", bg: "#F5EFE8", dark: "#1A1A1A" }
  if (!p?.cores || p.cores.length < 5) return defaults
  return { primary: p.cores[0], secondary: p.cores[1], light: p.cores[2], bg: p.cores[3], dark: p.cores[4] }
}
`;

content = content.replace(
  /function stripEmojis/,
  helper + '\nfunction stripEmojis'
);

// Step 2: Update ProdutoInfo interface
content = content.replace(
  /interface ProdutoInfo \{[\s\S]*?\}/,
  `interface ProdutoInfo {
  nome: string
  tag: string
  descricao: string
  publico: string
  paleta?: { id: string; nome: string; cores: string[] }
  fonte?: { id: string; nome: string }
}`
);

// Step 3: Add state vars for palette/font
content = content.replace(
  /const \[capaPhotoReels, setCapaPhotoReels\] = useState<string \| null>\(null\)/,
  `const [capaPhotoReels, setCapaPhotoReels] = useState<string | null>(null)
  const [selectedPalette, setSelectedPalette] = useState<{ id: string; nome: string; cores: string[] } | null>(null)
  const [selectedFont, setSelectedFont] = useState<{ id: string; nome: string } | null>(null)`
);

// Step 4: Update handleSelectProduto to store palette/font
content = content.replace(
  /setExpandedSteps\(\[\]\)\s*\n\s*const tomText/,
  `setExpandedSteps([])
    if (produtoInfo?.paleta) setSelectedPalette(produtoInfo.paleta)
    if (produtoInfo?.fonte) setSelectedFont(produtoInfo.fonte)

    const tomText`
);

// Step 5: Find the artifact section and update it
const artifactStart = content.indexOf('// === ARTEFATOS ===');
const fallbacksEnd = content.indexOf('const LS_KEY');
if (artifactStart === -1 || fallbacksEnd === -1) {
  console.error('Could not find artifact section boundaries');
  process.exit(1);
}

// Extract the non-artifact fallbacks (headline through escala)
const beforeArtifacts = content.substring(0, artifactStart);
const afterArtifacts = content.substring(fallbacksEnd);

// Build new artifact section with palette support
const newArtifacts = `// === ARTEFATOS ===
  logo: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Logo Principal SVG": \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 180" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:6/1"><defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="\${c.primary}"/><stop offset="100%" stop-color="\${c.secondary}"/></linearGradient></defs><rect width="1080" height="180" fill="\${c.bg}" rx="12"/><rect x="20" y="20" width="140" height="140" rx="24" fill="url(#lg)"/><text x="90" y="100" font-family="Georgia,serif" font-size="56" font-weight="bold" fill="#FFFFFF" text-anchor="middle">V</text><rect x="175" y="40" width="4" height="40" rx="2" fill="\${c.light}"/><text x="195" y="80" font-family="'Helvetica Neue',Arial,sans-serif" font-size="26" font-weight="800" fill="\${c.dark}" textLength="780" lengthAdjust="spacingAndGlyphs">[NOME]</text><rect x="195" y="95" width="60" height="3" rx="1.5" fill="\${c.primary}"/><text x="195" y="130" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600" fill="\${c.primary}" letter-spacing="3" textLength="500" lengthAdjust="spacingAndGlyphs">[SUBTÍTULO]</text></svg>\`,
      "Logo Alternativo SVG": \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 180" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:6/1"><rect width="1080" height="180" fill="\${c.dark}" rx="12"/><circle cx="90" cy="90" r="50" fill="none" stroke="\${c.primary}" stroke-width="3"/><circle cx="90" cy="90" r="25" fill="\${c.primary}"/><text x="90" y="98" font-family="Georgia,serif" font-size="30" font-weight="bold" fill="#FFFFFF" text-anchor="middle">V</text><text x="170" y="80" font-family="'Helvetica Neue',Arial,sans-serif" font-size="26" font-weight="700" fill="#FFFFFF" textLength="800" lengthAdjust="spacingAndGlyphs">[NOME]</text><text x="170" y="115" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" font-weight="500" fill="\${c.light}" letter-spacing="3">[SUBTÍTULO]</text></svg>\`,
      "Cores da Marca": \`Primária: \${c.primary} | Secundária: \${c.secondary} | Fundo: \${c.bg} | Texto: \${c.dark} | Detalhe: \${c.light}\`,
      "Usos do Logo": "Versão Principal: fundo claro, uso geral. Versão Alternativa: fundo escuro, ideal para vídeos e stories.",
    }
  },
  capa: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Feed SVG": \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:4/5"><defs><linearGradient id="bg" x1="0" y1="0" x2="1080" y2="1350" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="\${c.dark}"/><stop offset="100%" stop-color="\${c.secondary}"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#bg)"/><circle cx="850" cy="200" r="250" fill="\${c.primary}" opacity="0.04"/><circle cx="200" cy="1100" r="200" fill="\${c.primary}" opacity="0.03"/><rect x="80" y="300" width="3" height="40" rx="1.5" fill="\${c.light}"/><text x="100" y="318" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="600" fill="\${c.light}" letter-spacing="4">[TAG]</text><polygon points="540,380 548,396 540,392 532,396" fill="\${c.light}" opacity="0.6"/><text x="540" y="460" font-family="'Helvetica Neue',Arial,sans-serif" font-size="34" font-weight="800" fill="#FFFFFF" text-anchor="middle">[HEADLINE]</text><text x="540" y="510" font-family="'Helvetica Neue',Arial,sans-serif" font-size="34" font-weight="800" fill="\${c.light}" text-anchor="middle">[DESTAQUE]</text><line x1="440" y1="540" x2="640" y2="540" stroke="\${c.primary}" stroke-width="2" opacity="0.5"/><text x="540" y="585" font-family="Arial,sans-serif" font-size="15" font-weight="400" fill="#FFFFFF" opacity="0.5" text-anchor="middle">[SUBTÍTULO]</text><rect x="80" y="1140" width="920" height="90" rx="6" fill="\${c.primary}" opacity="0.08"/><text x="540" y="1180" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">[NOME DO PRODUTO]</text><text x="540" y="1205" font-family="Arial,sans-serif" font-size="12" fill="\${c.light}" text-anchor="middle">[OFERTA]</text></svg>\`,
      "Reels SVG": \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:9/16"><defs><linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1920" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="\${c.dark}"/><stop offset="100%" stop-color="\${c.secondary}"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#bg2)"/><circle cx="900" cy="300" r="260" fill="\${c.primary}" opacity="0.04"/><circle cx="150" cy="1600" r="210" fill="\${c.primary}" opacity="0.03"/><rect x="80" y="700" width="3" height="40" rx="1.5" fill="\${c.light}"/><text x="100" y="718" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" font-weight="600" fill="\${c.light}" letter-spacing="4">[TAG]</text><polygon points="540,800 548,816 540,812 532,816" fill="\${c.light}" opacity="0.6"/><text x="540" y="880" font-family="'Helvetica Neue',Arial,sans-serif" font-size="38" font-weight="800" fill="#FFFFFF" text-anchor="middle">[HEADLINE]</text><text x="540" y="935" font-family="'Helvetica Neue',Arial,sans-serif" font-size="38" font-weight="800" fill="\${c.light}" text-anchor="middle">[DESTAQUE]</text><line x1="440" y1="965" x2="640" y2="965" stroke="\${c.primary}" stroke-width="2" opacity="0.5"/><text x="540" y="1015" font-family="Arial,sans-serif" font-size="17" font-weight="400" fill="#FFFFFF" opacity="0.5" text-anchor="middle">[SUBTÍTULO]</text><rect x="80" y="1700" width="920" height="90" rx="6" fill="\${c.primary}" opacity="0.08"/><text x="540" y="1740" font-family="'Helvetica Neue',Arial,sans-serif" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">[NOME DO PRODUTO]</text><text x="540" y="1765" font-family="Arial,sans-serif" font-size="13" fill="\${c.light}" text-anchor="middle">[OFERTA]</text></svg>\`,
      "Dicas de Uso": "Feed: 1080x1350 (4:5). Reels: 1080x1920 (9:16). Poste como imagem ou capa de video.",
    }
  },
  card_oferta: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Card Oferta SVG": \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" style="max-width:100%;width:100%;height:auto;display:block;aspect-ratio:4/5"><defs><linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="\${c.dark}"/><stop offset="100%" stop-color="\${c.secondary}"/></linearGradient><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="\${c.primary}"/><stop offset="100%" stop-color="\${c.secondary}"/></linearGradient></defs><rect width="1080" height="1350" fill="url(#cbg)"/><rect x="30" y="30" width="1020" height="1290" rx="24" fill="none" stroke="\${c.primary}" stroke-width="2" opacity="0.3"/><circle cx="540" cy="800" r="320" fill="\${c.primary}" opacity="0.04"/><text x="540" y="220" font-family="'Helvetica Neue',Arial,sans-serif" font-size="32" font-weight="700" fill="\${c.light}" text-anchor="middle" letter-spacing="8">OFERTA ESPECIAL</text><rect x="440" y="250" width="200" height="2" fill="\${c.light}" opacity="0.5"/><text x="540" y="420" font-family="'Helvetica Neue',Arial,sans-serif" font-size="26" font-weight="400" fill="#FFFFFF" opacity="0.5" text-anchor="middle" text-decoration="line-through">DE [VALOR CHEIO]</text><text x="540" y="540" font-family="'Helvetica Neue',Arial,sans-serif" font-size="110" font-weight="800" fill="#FFFFFF" text-anchor="middle">[VALOR]</text><text x="540" y="620" font-family="Arial,sans-serif" font-size="26" font-weight="400" fill="\${c.light}" text-anchor="middle">ou 12x de [PARCELA]</text><rect x="290" y="730" width="500" height="65" rx="32" fill="url(#cg)"/><text x="540" y="772" font-family="'Helvetica Neue',Arial,sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">GARANTIR OFERTA</text><text x="540" y="900" font-family="Arial,sans-serif" font-size="16" fill="#FFFFFF" opacity="0.5" text-anchor="middle">Oferta por tempo limitado</text></svg>\`,
      "Indicado para": "Instagram Stories, Facebook Ads, WhatsApp, E-mail Marketing",
      "Copy para Legenda": "A oferta especial do [NOME DO PRODUTO] chegou! De [VALOR CHEIO] por apenas [VALOR] à vista ou 12x de [PARCELA]. Vagas limitadas - garanta a sua agora! Link na bio.",
    }
  },
  certificado: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "Certificado SVG": \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 842 595" width="842" height="595"><defs><linearGradient id="cborder" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="\${c.primary}"/><stop offset="100%" stop-color="\${c.light}"/></linearGradient></defs><rect width="842" height="595" fill="\${c.bg}"/><rect x="15" y="15" width="812" height="565" fill="none" stroke="url(#cborder)" stroke-width="2" rx="8"/><rect x="25" y="25" width="792" height="545" fill="none" stroke="\${c.light}" stroke-width="0.5" rx="6"/><circle cx="421" cy="80" r="40" fill="\${c.primary}" opacity="0.1"/><text x="421" y="90" font-family="Georgia,serif" font-size="40" font-weight="bold" fill="\${c.primary}" text-anchor="middle">CERTIFICADO</text><text x="421" y="130" font-family="Georgia,serif" font-size="18" fill="\${c.primary}" text-anchor="middle" letter-spacing="6">DE CONCLUSÃO</text><rect x="300" y="145" width="242" height="1" fill="\${c.light}"/><text x="421" y="210" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14" fill="\${c.secondary}" text-anchor="middle">Concedemos o presente certificado a</text><text x="421" y="280" font-family="Georgia,serif" font-size="32" font-weight="bold" fill="\${c.dark}" text-anchor="middle">[NOME DO ALUNO]</text><rect x="320" y="300" width="202" height="2" fill="\${c.primary}"/><text x="421" y="350" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" fill="\${c.secondary}" text-anchor="middle">Por ter concluído com êxito o curso</text><text x="421" y="400" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="\${c.primary}" text-anchor="middle">[NOME DO CURSO]</text><text x="421" y="440" font-family="'Helvetica Neue',Arial,sans-serif" font-size="12" fill="\${c.secondary}" text-anchor="middle">Carga horária: 40 horas</text><line x1="200" y1="510" x2="350" y2="510" stroke="\${c.dark}" stroke-width="0.5"/><text x="275" y="530" font-family="Arial,sans-serif" font-size="10" fill="\${c.secondary}" text-anchor="middle">Assinatura</text><line x1="492" y1="510" x2="642" y2="510" stroke="\${c.dark}" stroke-width="0.5"/><text x="567" y="530" font-family="Arial,sans-serif" font-size="10" fill="\${c.secondary}" text-anchor="middle">Data: [DATA]</text></svg>\`,
      "Instruções": "Substitua os placeholders entre colchetes. O SVG pode ser salvo como imagem, impresso ou convertido para PDF diretamente no navegador.",
      "Personalização": \`Adicione seu logo no canto superior esquerdo. Paleta aplicada: \${p?.paleta?.nome || "Marrom Clássico"}.\`,
    }
  },
  landing: (_, __, p) => {
    const c = getPaletteColors(p?.paleta)
    return {
      "HTML Landing Page": \`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>[NOME DO PRODUTO]</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}:root{--brown:\${c.primary};--brown-dark:\${c.secondary};--gold:\${c.light};--cream:\${c.bg};--dark:\${c.dark};--dark2:\${c.secondary};--muted:\${c.secondary}}html{scroll-behavior:smooth}body{font-family:'Inter',sans-serif;color:var(--dark);background:var(--cream);line-height:1.7;overflow-x:hidden}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,var(--dark) 0%,var(--dark2) 40%,#3D2A1A 100%);color:#fff;padding:80px 24px;text-align:center;position:relative;overflow:hidden}.hero::before{content:'';position:absolute;top:-30%;right:-20%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(139,94,60,0.15) 0%,transparent 70%);pointer-events:none}.hero::after{content:'';position:absolute;bottom:-20%;left:-10%;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(212,184,150,0.08) 0%,transparent 70%);pointer-events:none}.hero-content{position:relative;z-index:1;max-width:760px;margin:0 auto}.badge{display:inline-block;background:rgba(139,94,60,0.2);border:1px solid rgba(139,94,60,0.4);color:var(--gold);padding:8px 20px;border-radius:50px;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-bottom:32px}.hero h1{font-family:'Playfair Display',serif;font-size:clamp(36px,7vw,64px);font-weight:900;line-height:1.05;margin-bottom:24px;letter-spacing:-1.5px}.hero h1 span{color:var(--gold);display:block}.hero p{font-size:clamp(16px,2.2vw,20px);color:rgba(255,255,255,0.65);margin-bottom:40px;max-width:520px;margin-left:auto}</style></head><body><section class="hero"><div class="hero-content"><div class="badge">[TAG]</div><h1>[HEADLINE]<span>[DESTAQUE]</span></h1><p>[SUBTÍTULO]</p><a href="#oferta" style="display:inline-block;background:var(--brown);color:#fff;padding:16px 40px;border-radius:12px;font-weight:700;font-size:16px;text-decoration:none">GARANTIR ACESSO</a></div></section></body></html>\`,
      "Como Usar": "Copie o HTML completo, substitua os placeholders entre colchetes []. Salve como .html e abra no navegador.",
      "Personalização": \`Troque as cores pela paleta da sua marca (\${c.primary}, \${c.light}, \${c.bg}). Adicione imagens reais entre as seções.\`,
    }
  },
  story: () => ({
    "Slide 1 - Gancho": "Cena: Tela preta com texto gigante centralizado\\nTexto na tela: 'Voce ja tentou [PROBLEMA] e nao conseguiu?'\\nLocucao: tom de identificacao, pausa dramatica de 2s\\nDuracao: 0-3s",
    "Slide 2 - Dor": "Cena: Close de alguem frustrado mexendo no celular\\nTexto na tela: 'A maioria desiste por falta de metodo' (animacao de digitacao)\\nFundo: gradiente escuro com textura sutil\\nDuracao: 3-6s",
    "Slide 3 - Solucao": "Cena: Produto sendo apresentado (mockup do curso/ebook)\\nTexto: 'Apresentamos o [NOME DO PRODUTO]' em fade-in\\nEfeito: spotlight no produto\\nDuracao: 6-10s",
    "Slide 4 - Prova": "Cena: Depoimento real em destaque com foto do aluno\\nTexto: '[DEPOIMENTO]'\\nFundo: claro para destacar o depoimento\\nDuracao: 10-14s",
    "Slide 5 - Beneficios": "Cena: Icones aparecendo um por um\\nTopicos na tela:\\n  [BENEFICIO 1]\\n  [BENEFICIO 2]\\n  [BENEFICIO 3]\\nEfeito: cada item aparece com um swipe\\nDuracao: 14-20s",
    "Slide 6 - Oferta": "Cena: Card de oferta em destaque com gradiente\\nPreco gigante: 'R$ [VALOR]' com line-through no preco cheio\\nElemento: 'Oferta por tempo limitado'\\nDuracao: 20-25s",
    "Slide 7 - CTA Final": "Cena: Botao pulsando no centro da tela\\nTexto: 'VAGAS LIMITADAS - GARANTA A SUA' + 'Clique no link da bio'\\nEfeito: CTA com glow pulsante\\nDuracao: 25-30s",
    "Dicas de Producao": "Grave cada slide como takes separados de 3-5s. Use cortes secos. Legenda automatica no Instagram. Musica: instrumental crescente (energy up). Call to action no ultimo slide com link na bio.",
  }),
}

`;

content = beforeArtifacts + newArtifacts + afterArtifacts;

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log('Dashboard updated successfully');
