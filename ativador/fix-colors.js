const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Replace hardcoded colors with palette variables
const replacements = [
  ['fill="#8B5E3C"', 'fill="${c.primary}"'],
  ['fill="#6B4226"', 'fill="${c.secondary}"'],
  ['fill="#D4B896"', 'fill="${c.light}"'],
  ['fill="#F5EFE8"', 'fill="${c.bg}"'],
  ['fill="#1A1A1A"', 'fill="${c.dark}"'],
  ['fill="#2D2D2D"', 'fill="${c.secondary}"'],
  ['fill="#0D0D0D"', 'fill="${c.dark}"'],
  ['fill="#5C3A1E"', 'fill="${c.secondary}"'],
  ['stop-color="#8B5E3C"', 'stop-color="${c.primary}"'],
  ['stop-color="#6B4226"', 'stop-color="${c.secondary}"'],
  ['stop-color="#1A1A1A"', 'stop-color="${c.dark}"'],
  ['stop-color="#2D2D2D"', 'stop-color="${c.secondary}"'],
  ['stop-color="#0D0D0D"', 'stop-color="${c.dark}"'],
  ['stop-color="#5C3A1E"', 'stop-color="${c.secondary}"'],
  ['stroke="#8B5E3C"', 'stroke="${c.primary}"'],
  ['stroke="#1A1A1A"', 'stroke="${c.dark}"'],
  // CSS variables in landing page
  ['--brown:#8B5E3C', '--brown:${c.primary}'],
  ['--brown-dark:#6B4226', '--brown-dark:${c.secondary}'],
  ['--gold:#D4B896', '--gold:${c.light}'],
  ['--cream:#F5EFE8', '--cream:${c.bg}'],
  ['--dark:#1A1A1A', '--dark:${c.dark}'],
  ['--dark2:#2D2D2D', '--dark2:${c.secondary}'],
  ['--muted:#5C5146', '--muted:${c.secondary}'],
];

for (const [from, to] of replacements) {
  content = content.split(from).join(to);
}

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log('Colors replaced successfully');

