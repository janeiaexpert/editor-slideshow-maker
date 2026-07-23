const fs = require('fs');
const code = fs.readFileSync('C:\\Users\\Administrador\\Downloads\\Gerador de Carrossel Vercel\\squad mentoria\\Aplicativo Persona\\Ativador de Produto\\app.js', 'utf8');
const lines = code.split('\n');
const fnCode = lines.slice(0, 157).join('\n') + `

const p = gerarProdutoViral('Ensinar mulheres empreendedoras', 'Simples', 0);
console.log('mods:', typeof p.mods, Array.isArray(p.mods) ? 'array('+p.mods.length+')' : p.mods.substring(0,40));
`;
require('fs').writeFileSync('C:\\Users\\Administrador\\Downloads\\Gerador de Carrossel Vercel\\squad mentoria\\Aplicativo Persona\\ativador_produto_test.js', fnCode);
