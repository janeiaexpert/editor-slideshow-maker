const fs = require('fs');
const path = require('path');

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

const files = walk('src');
const issues = [];

files.forEach(fp => {
  const buf = fs.readFileSync(fp);
  const t = buf.toString('utf8');
  const lines = t.split('\n');
  lines.forEach((l, ln) => {
    for (let i = 0; i < l.length; i++) {
      const c = l.charCodeAt(i);
      // Detect broken C1 control chars (should never appear in source)
      if (c >= 0x80 && c <= 0x9F && c !== 0x85) {
        const ctx = l.substring(Math.max(0, i - 15), i + 15);
        issues.push({ file: fp, line: ln + 1, pos: i, charCode: c, context: ctx });
      }
      // Detect em-dash pattern: â (U+00E2) followed by broken byte
      if (c === 0x00E2 && i + 1 < l.length) {
        const next = l.charCodeAt(i + 1);
        if (next === 0x80 || next === 0x94 || next === 0x93) {
          const ctx = l.substring(Math.max(0, i - 15), i + 20);
          issues.push({ file: fp, line: ln + 1, pos: i, charCode: c, context: ctx, note: 'likely broken em-dash' });
        }
      }
    }
  });
});

if (issues.length === 0) {
  console.log('No broken characters found in source files.');
} else {
  console.log('BROKEN CHARACTERS FOUND:', issues.length);
  issues.forEach(x => {
    console.log(`  ${x.file}:${x.line} pos=${x.pos} code=U+${x.charCode.toString(16).toUpperCase().padStart(4,'0')} ${x.note||''}`);
    console.log(`    context: ${x.context}`);
  });
}
