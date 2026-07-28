const fs = require('fs');
const path = require('path');

// Map of broken C1 control character sequences -> correct characters
// These are UTF-8 multi-byte chars that got double-encoded (read as Latin-1, re-saved as UTF-8)
const REPLACEMENTS = [
  // Em-dash: U+00E2 U+0080 U+0094 -> — (U+2014)
  ['\u00E2\u0080\u0094', '\u2014'],
  // Right arrow: U+00E2 U+0086 U+0092 -> → (U+2192)
  ['\u00E2\u0086\u0092', '\u2192'],
  // Checkmark: U+00E2 U+009C U+93 -> ✓ (U+2713)
  ['\u00E2\u009C\u0093', '\u2713'],
  // Bullet: U+00E2 U+009C U+00AA -> ✪ or similar
  ['\u00E2\u009C\u00AA', '\u272A'],
  // Fire emoji: U+00F0 U+009F U+0094 U+00A5 -> 🔥
  ['\u00F0\u009F\u0094\u00A5', '\uD83D\uDD25'],
  // Check box emoji: U+00F0 U+009F U+0091 U+008D -> 🂭
  ['\u00F0\u009F\u0091\u008D', '\uD83D\uDD3D'],
  // Flexed bicep: U+00F0 U+009F U+0092 U+00AA -> 💪
  ['\u00F0\u009F\u0092\u00AA', '\uD83D\uDCAA'],
  // Clapper: U+00F0 U+009F U+008E U+00AC -> 🎬
  ['\u00F0\u009F\u008E\u00AC', '\uD83C\uDFAC'],
  // Stars: U+00E2 U+009C U+00A8 -> ✨ (sparkles)
  ['\u00E2\u009C\u00A8', '\u2728'],
  // Star: U+00E2 U+00AD U+0090 -> ⭐
  ['\u00E2\u00AD\u0090', '\u2B50'],
  // Light bulb: U+00F0 U+009F U+0092 U+00A1 -> 💡
  ['\u00F0\u009F\u0092\u00A1', '\uD83D\uDCA1'],
  // Rocket: U+00F0 U+009F U+009A U+0080 -> 🚀
  ['\u00F0\u009F\u009A\u0080', '\uD83D\uDE80'],
  // Target: U+00F0 U+009F U+008F U+00AF -> 🎯
  ['\u00F0\u009F\u008E\u00AF', '\uD83C\uDFAF'],
  // Chart: U+00F0 U+009F U+0093 U+008A -> 📊
  ['\u00F0\u009F\u0093\u008A', '\uD83D\uDCCA'],
  // Money bag: U+00F0 U+009F U+0092 U+00B0 -> 💰
  ['\u00F0\u009F\u0092\u00B0', '\uD83D\uDCB0'],
  // Gift: U+00F0 U+009F U+008E U+0081 -> 🎁
  ['\u00F0\u009F\u008E\u0081', '\uD83C\uDF81'],
  // Lightning: U+00E2 U+009A U+00A1 -> ⚡
  ['\u00E2\u009A\u00A1', '\u26A1'],
  // Warning: U+00E2 U+009A U+00A0 -> ⚠
  ['\u00E2\u009A\u00A0', '\u26A0'],
  // Heart: U+00E2\u009D\u00A4 -> ❤
  ['\u00E2\u009D\u00A4', '\u2764'],
  // Thumbs up: U+00F0\u009F\u0091\u008D -> 👍
  ['\u00F0\u009F\u0091\u008D', '\uD83D\uDC4D'],
  // Broken Â©: U+00C3 U+0082 U+00A9 -> ©
  ['\u00C3\u0082\u00A9', '\u00A9'],
  // Standalone Â©: already fixed to ©
  // Left single quote: U+00E2\u009C\u0093 was checkmark, already above
  // Standalone U+0094 -> should be part of em-dash, but if orphaned, replace with —
  // We handle these in context below
];

function walk(dir) {
  const results = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    const st = fs.statSync(fp);
    if (st.isDirectory() && !f.includes('node_modules') && !f.includes('.next') && !f.includes('generated')) {
      results.push(...walk(fp));
    } else if (st.isFile() && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
      results.push(fp);
    }
  });
  return results;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Apply all replacements
  for (const [broken, correct] of REPLACEMENTS) {
    while (content.includes(broken)) {
      content = content.replace(broken, correct);
    }
  }
  
  // Handle orphaned C1 control characters that are part of broken sequences
  // Pattern: U+00E2 followed by any C1 byte (U+0080-U+009F) — these are partial em-dash/arrow/etc
  // Replace based on the second byte
  content = content.replace(/\u00E2\u0080/g, '\u2014');   // em-dash (0x80 0x94 pattern)
  content = content.replace(/\u00E2\u0094/g, '\u2014');   // em-dash tail
  content = content.replace(/\u00E2\u0086/g, '\u2192');   // arrow (0x86 0x92 pattern)
  content = content.replace(/\u00E2\u0092/g, '\u2192');   // arrow tail
  content = content.replace(/\u00E2\u009C/g, '\u2713');   // checkmark (0x9C 0x93 pattern)
  content = content.replace(/\u00E2\u0093/g, '\u2713');   // checkmark tail
  content = content.replace(/\u00E2\u009F/g, '\u2713');   // some other symbol
  content = content.replace(/\u00E2\u009D/g, '\u2764');   // heart
  content = content.replace(/\u00E2\u009A/g, '\u26A1');   // lightning
  content = content.replace(/\u00E2\u009B/g, '\u26A0');   // warning
  content = content.replace(/\u00E2\u00AD/g, '\u2B50');   // star
  
  // Handle orphaned 0x94 (tail of em-dash)
  content = content.replace(/\u0094/g, '\u2014');
  // Handle orphaned 0x92 (tail of arrow)
  content = content.replace(/\u0092/g, '\u2192');
  // Handle orphaned 0x93 (tail of checkmark)
  content = content.replace(/\u0093/g, '\u2713');
  // Handle orphaned 0x86 (part of arrow)
  content = content.replace(/\u0086/g, '\u2192');
  // Handle orphaned 0x80 (part of em-dash)
  content = content.replace(/\u0080/g, '\u2014');
  // Handle orphaned 0x9C (part of checkmark/symbol)
  content = content.replace(/\u009C/g, '\u2713');
  // Handle orphaned 0x9F (part of emoji/symbol)
  content = content.replace(/\u009F/g, '\u2713');
  // Handle orphaned 0x85 (next line)
  content = content.replace(/\u0085/g, '\n');
  // Handle orphaned 0x8E (part of double byte)
  content = content.replace(/\u008E/g, '');
  // Handle orphaned 0x96 (em dash variant)
  content = content.replace(/\u0096/g, '\u2014');
  // Handle orphaned 0x97 (em dash variant)
  content = content.replace(/\u0097/g, '\u2014');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

const files = walk('src');
let fixed = 0;
files.forEach(fp => {
  if (fixFile(fp)) {
    fixed++;
    console.log('FIXED:', fp);
  }
});
console.log(`\nTotal files fixed: ${fixed} / ${files.length}`);
