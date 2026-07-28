const fs = require('fs');
const path = 'C:/Users/Administrador/Downloads/Gerador de Carrossel Vercel/ativador/src/app/dashboard/page.tsx';
let t = fs.readFileSync(path, 'utf8');

// Replace replacement character
t = t.replace(/\uFFFD/g, '');

// Fix em-dash
t = t.replace(/\u00E2\u0080\u0094/g, '\u2014');

// Fix all remaining broken accented chars via targeted replacements
const replacements = [
  // titles and descriptions
  ['Entreg\u00E1veis', 'Entreg\u00E1veis'],
];

// Specific patterns with broken encoding
const pairs = [
  ['gr\u00E1ficos', 'gr\u00E1ficos'],
  ['P\u00E1gina', 'P\u00E1gina'],
  ['pr\u00E1tica', 'pr\u00E1tica'],
  ['necess\u00E1rios', 'necess\u00E1rios'],
  ['hor\u00E1ria', 'hor\u00E1ria'],
  ['r\u00E1pidas', 'r\u00E1pidas'],
  ['r\u00E1pida', 'r\u00E1pida'],
  ['b\u00E1sico', 'b\u00E1sico'],
  ['j\u00E1', 'j\u00E1'],
  ['est\u00E1', 'est\u00E1'],
  ['tr\u00E1s', 'tr\u00E1s'],
  ['gr\u00E1tis', 'gr\u00E1tis'],
  ['t\u00E1 ', 't\u00E1 '],
  ['coment\u00E1rios', 'coment\u00E1rios'],
  ['Prim\u00E1ria', 'Prim\u00E1ria'],
  ['Secund\u00E1ria', 'Secund\u00E1ria'],
  ['autom\u00E1tica', 'autom\u00E1tica'],
  ['obst\u00E1culo', 'obst\u00E1culo'],
  ['VSL \u00E2\u0080\u0094', 'VSL \u2014'],
  ['pr\u00E9tico', 'pr\u00E1tico'],
  ['obst\u00C3\u00A1culo', 'obst\u00E1culo'],
  ['N\u00C3\u0093', 'N\u00C3\u0093'],
];

// Write the fixed content
fs.writeFileSync(path, t, 'utf8');
console.log('Done. Checking remaining issues...');

// Now read and do a simpler fix - find all unique broken sequences
const content = fs.readFileSync(path, 'utf8');
const broken = content.match(/[\u00C0-\u00FF]{2,}/g);
if (broken) {
  const unique = [...new Set(broken)];
  console.log('Broken sequences found:', unique.length);
  unique.forEach(b => console.log('  ', JSON.stringify(b)));
}
