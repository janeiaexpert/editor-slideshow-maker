// Fix double-encoded UTF-8 characters in SVG icon strings
const fs = require('fs');
const path = require('path');

// Map of double-encoded UTF-8 bytes (from Latin-1 or Windows-1252) -> proper UTF-8
const REPLACEMENTS = {
  // Em-dash: \xE2\x80\x94 -> U+2014
  '\u00E2\u0080\u0094': '\u2014',
  // Right arrow: \xE2\x86\x92 -> U+2192
  '\u00E2\u0086\u0092': '\u2192',
  // Checkmark: \xE2\x9C\x93 -> U+2713
  '\u00E2\u009C\u0093': '\u2713',
  // Bullet: \xE2\x9C\xAA -> U+272A
  '\u00E2\u009C\u00AA': '\u272A',
  // Fire: \xF0\x9F\x94\xA5 -> U+D83D U+DD25
  '\u00F0\u009F\u0094\u00A5': '\uD83D\uDD25',
  // Target: \xF0\x9F\x8E\xAF -> U+D83C U+0F0F
  '\u00F0\u009F\u008E\u00AF': '\uD83C\uDFAF',
  // Warning: \xE2\x9A\u00A0 -> U+26A0
  '\u00E2\u009A\u00A0': '\u26A0',
  // Heart: \xE2\u009D\u00A4 -> U+2764
  '\u00E2\u009D\u00A4': '\u2764',
  // Speaker: \xF0\u009F\u008A\u009F -> U+D83D U+DDCF
  '\u00F0\u009F\u008A\u009F': '\uD83D\uDDCF',
  // Light bulb: \xF0\x9F\x92\xA1 -> U+D83D U+DCA1
  '\u00F0\u009F\u0092\u00A1': '\uD83D\uDCA1',
  // Closed lock: \xF0\u009F\u90\u91 -> U+D83D U+DCDD
  '\u00F0\u009F\u0090\u0091': '\uD83D\uDCDD',
  // Explosion: \xF0\u009F\u914\u80 -> U+D83D U+DD28
  '\u00F0\u009F\u0114\u0080': '\uD83D\uDD28',
  // Rainbow: \xF0\u009F\u8C\u8F -> U+D83D U+DE08
  '\u00F0\u009F\u008C\u008F': '\uD83D\uDE08',
  // Umbrella: \u00F0\u009F\u91\u93 -> U+D83D U+DDFA
  '\u00F0\u009F\u0091\u0093': '\uD83D\uDDFA',
  // Snowflake: \xE2\u009A\u00B0 -> U+2744
  '\u00E2\u009A\u00B0': '\u2744',
  // Sparkles: \xE2\u09C\u00A8 -> U+2728
  '\u00E2\u009C\u00A8': '\u2728',
  // Sparkle: \xE2\u009D\u0090 -> U+2B50
  '\u00E2\u009D\u0090': '\u2B50',
  // Fire: \xE2\u009A\u00A1 -> U+26A1
  '\u00E2\u009A\u00A1': '\u26A1',
}

function fixSvgContent(content) {
  let fixed = content;
  for (const [broken, correct] of Object.entries(REPLACEMENTS)) {
    fixed = fixed.replaceAll(broken, correct);
  }
  
  // Handle orphaned C1 control characters in the range U+0080 to U+009F
  // These are often the tail bits of broken sequences
  const c1Map = {
    '\u0080': '\u2014', // part of em-dash
    '\u0081': '\u2013', // en dash
    '\u0082': '\u2013', // en dash
    '\u0083': '\u2026', // ellipsis
    '\u0084': '\u2026',
    '\u0085': '\n',     // newline
    '\u0086': '\u2192', // part of arrow
    '\u0087': '',      // delete
    '\u0088': '\u201D', // right double quote
    '\u0089': '\u201C', // left double quote
    '\u008A': '\u2026',
    '\u008B': '\u2026',
    '\u008C': '\u2026',
    '\u008D': '\u2026',
    '\u008E': '',      // empty
    '\u008F': '',
    '\u0090': '\u2026',
    '\u0091': '\u2018', // left single quote
    '\u0092': '\u2019', // right single quote
    '\u0093': '\u2013',
    '\u0094': '\u2014', // em dash
    '\u0095': '',
    '\u0096': '\u2014',
    '\u0097': '\u2014',
    '\u0098': '',
    '\u0099': '',
    '\u009A': '',
    '\u009B': '',
    '\u009C': '\u2713',
    '\u009D': '\u2714',
    '\u009E': '',
    '\u009F': '',
  };
  
  for (const [c1, replacement] of Object.entries(c1Map)) {
    fixed = fixed.replaceAll(c1, replacement);
  }
  
  return fixed;
}

function walk(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.next') && !item.name.includes('generated')) {
      files.push(...walk(fullPath));
    } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts') || item.name.endsWith('.json') || item.name.endsWith('.md'))) {
      files.push(fullPath);
    }
  }
  return files;
}

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if content contains any broken character sequences
    const hasBrokenChars = Object.keys(REPLACEMENTS).some(broken => content.includes(broken));
    if (!hasBrokenChars) return false;
    
    const original = content;
    content = fixSvgContent(content);
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`FIXED: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`ERROR fixing ${filePath}:`, error.message);
  }
  return false;
}

const files = walk('src');
const brokenFiles = files.filter(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    return Object.keys(REPLACEMENTS).some(broken => content.includes(broken));
  } catch {
    return false;
  }
});

console.log(`Encontrados ${brokenFiles.length} arquivos com caracteres quebrados.\n`);

const fixed = brokenFiles.reduce((count, fp) => fixFile(fp) ? count + 1 : count, 0);
console.log(`\nTotal de arquivos corrigidos: ${fixed} de ${brokenFiles.length}`);