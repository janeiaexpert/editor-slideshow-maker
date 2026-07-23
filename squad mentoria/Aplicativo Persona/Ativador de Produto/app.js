function gerarProdutoViral(ideia, tom, seed) {
  const t = ideia.replace(/^(quero|querendo|vou|criar|criando|ensinar|ensinando|aprender|aprendendo|ter|fazer|fazendo|domin[ai]r|descobrir|vender|vendendo|produzir|montar|desenvolver|criar\s+um|criar\s+uma|criar\s+conte[dú]do|criar\s+produtos?|para|como)\s+/i,"").replace(/[—\-–].*/,"").trim();
  const filler = /^(de|para|em|com|o|a|os|as|do|da|dos|das|no|na|nos|nas|um|uma|uns|umas|que|se|por|sem|como|mais|mas|j[aá]|n[aã]o|aos|ao|entre|sobre|tamb[ée]m|muito|bem|vai|pode|tem|ter|seu|sua|seus|suas|essa|esse|isso|isto|este|esta|essas|esses|meu|minha|atrav[ée]s|ap[óo]s|antes|depois|durante|quando|onde|assim|mesmo|ainda|todo|toda|tudo|cada|sempre|nunca|s[eo])$/i;
  const palavras = t.split(/\s+/).filter(w => !filler.test(w)).slice(0,2);
  const topico = palavras.length ? palavras.join(" ") : (t.split(/\s+/).slice(0,2).join(" ") || "Transformação");
  const caps = topico.charAt(0).toUpperCase()+topico.slice(1);
  const low = topico.toLowerCase();
  const seedIdx = (seed||0) % 6;

  // Pool de validações realistas
  const VAL = [
    { desc:"Método validado por mais de "+(10+seed*3)+" mil alunos em "+((seed%3+1)*2+10)+" países", breve:(8+seed*2)+"K+ alunos — "+(seed%7+90)+"% de conclusão" },
    { desc:"Resultados comprovados — "+(80+seed*5)+"% dos alunos alcançam o objetivo em até "+(seed%4+3)+" semanas", breve:(seed%3+4)+"."+((seed*7)%10)+"★ — "+(10+seed*6)+" mil avaliações" },
    { desc:"Usado por "+((seed%5+1)*4)+" mil pessoas em "+(seed%4+5)+" países — "+(seed%8+92)+"% de satisfação", breve:(seed%4+3)+"K+ usuários — "+(seed%7+90)+"% retenção" },
    { desc:"Top "+(seed%3+1)+" mais vendido em marketplaces digitais 2026 — "+((seed%5+2)*3)+" mil cópias", breve:(seed%3+5)+"."+((seed*11)%10)+"★ — "+(seed%8+3)+"K+ vendas" },
    { desc:""+(seed%3+8)+" mil alunas ativas — taxa de engajamento de "+(seed%5+2)+"x maior que a média", breve:"#"+(seed%10+1)+" mais vendido — "+(seed%6+8)+"K alunos" },
    { desc:"Dados reais: "+(20+seed*4)+"% de conversão em "+(seed%3+7)+" dias — estudo com "+(100+seed*37)+" participantes", breve:(seed%4+2)+"K+ leads gerados — "+(seed%7+90)+"% aprovação" },
  ];
  const val = VAL[seedIdx];
  const validados = [val.desc, val.breve];

  // Pool de nomes para produtos conforme arquétipo
  const ARQ = [
    { emoji:"◎", nome:"Desafio de "+caps, sufixo:"em "+(seed%30+15)+" Dias", descS:"Desafio prático de "+low,
      template:(a,s,b,p) => [
        a+" — "+s,
        b+" enquanto você segue o passo a passo diário",
        p+" em "+(seed%15+7)+" dias — "+validados[1],
        "Você já tentou "+low+" e não conseguiu? Não é culpa sua. A maioria das pessoas desiste na primeira semana porque falta um sistema. O "+a+" te dá um dia a dia estruturado. Cada dia você completa uma tarefa. No final, o resultado é inevitável.",
        "Enquanto você "+(seed%2?"começa e para":"tenta sozinho e se frustra")+", "+validados[0].split("—")[0].trim()+" já transformaram o resultado seguindo este método.",
        "Imagine em "+(seed%15+7)+" dias você dominando "+low+" como se já fizesse isso há anos.",
        ["Diagnóstico inicial: onde você está e para onde precisa ir — mapeamento personalizado em "+((seed%5)*2+10)+" minutos",
        "Dia a dia estruturado: "+((seed%5)+5)+" passos diários de "+((seed%3)*5+10)+" minutos cada — consistência acima de perfeição",
        "Materiais de apoio: "+((seed%3)+3)+" ferramentas e recursos que eliminam as desculpas mais comuns",
        "Acompanhamento semanal: 3 checkpoints de evolução com ajustes de rota — "+(seed%7+90)+"% de quem segue chega ao final",
        "Celebração e próximo nível: como manter o resultado e elevar o padrão após o desafio"],
      ]},
    { emoji:"✦", nome:"Método "+["Alpha","Pro","Elite","Prime","Max","Flow"][seed%6]+" de "+caps, sufixo:"",
      descS:"Sistema completo e validado de "+low,
      template:(a,s,b,p) => [
        a+" — "+s,
        b+" aplicando o sistema passo a passo",
        p+" — "+validados[1],
        "Existe um jeito certo de fazer "+low+". E um jeito errado. O "+a+" é o atalho validado por quem já chegou onde você quer chegar. Não é teoria — é um sistema de "+((seed%3)+4)+" pilares que elimina tentativa e erro. Você só segue.",
        "Enquanto você insiste em tentativas que não funcionam, "+validados[0].split("—")[0]+" já dominam "+low+" com o sistema certo.",
        "Você merece um método que funcione — não mais uma tentativa frustrada.",
        ["Pilar 1 — Fundação: os "+(seed%5+3)+" princípios essenciais que ninguém te conta sobre "+low,
        "Pilar 2 — Estrutura: o passo a passo lógico que elimina confusão e sobrecarga",
        "Pilar 3 — Execução: o protocolo diário de "+(seed%3*10+15)+" minutos que gera resultado consistente",
        "Pilar 4 — Otimização: como identificar e corrigir os "+(seed%4+3)+" erros mais comuns em "+low,
        "Pilar 5 — Domínio: técnicas avançadas para quem quer ir além do básico e se tornar referência"],
      ]},
    { emoji:"□", nome:"Kit Completo de "+caps, sufixo:"",
      descS:"Todos os recursos que você precisa para "+low,
      template:(a,s,b,p) => [
        a+" — "+s,
        b+" com tudo que você precisa em um só lugar",
        p+" — "+validados[1],
        "Você não precisa de mais informação. Você precisa das ferramentas certas. O "+a+" reúne "+((seed%3)+3)+" recursos completos em um único pacote. Enquanto outros perdem horas caçando conteúdo disperso, você tem tudo organizado, testado e pronto para usar.",
        "Enquanto você se perde em tutoriais soltos, "+validados[0].split("—")[0]+" já usam o kit completo e entregam resultado.",
        "Tudo que você precisa em um lugar — sem busca, sem perda de tempo, sem desculpa.",
        ["Módulo "+((seed%3)+1)+" — "+["Fundamentos","Diagnóstico","Preparação"][seed%3]+": "+caps+" do absoluto zero — "+(seed%4+3)+" aulas objetivas",
        "Módulo "+((seed%3)+2)+" — "+["Ferramentas","Recursos","Templates"][seed%3]+": "+((seed%5)+5)+" modelos prontos para usar imediatamente em "+low,
        "Módulo "+((seed%3)+3)+" — "+["Execução","Prática","Aplicação"][seed%3]+": roteiro de implementação em "+(seed%4+5)+" dias com resultados reais",
        "Módulo "+(seed%4+4)+" — "+["Otimização","Escala","Aprimoramento"][seed%4%3]+": como acelerar seus resultados em "+low+" sem aumentar esforço",
        "Módulo "+(seed%5+5)+" — "+["Manutenção","Rotina","Hábito"][seed%5%3]+": sistema para manter o resultado e continuar evoluindo"],
      ]},
    { emoji:"▦", nome:caps+" do Zero ao Avançado", sufixo:"",
      descS:"Curso completo e progressivo de "+low,
      template:(a,s,b,p) => [
        a+" — "+s,
        b+" mesmo que você nunca tenha feito "+low+" antes",
        p+" — "+validados[1],
        "Não importa se você está começando do zero. O curso "+a+" foi desenhado para levar você do primeiro passo ao domínio completo. São "+(seed%4+5)+" módulos progressivos. Cada etapa constrói sobre a anterior. Você nunca fica para trás porque o conteúdo é feito para iniciantes que querem resultado de profissional.",
        "Enquanto você acha que "+low+" é difícil demais, "+validados[0].split("—")[0]+" já aprenderam do zero e aplicam todo dia.",
        "Do zero ao domínio — no seu ritmo, com resultado garantido.",
        ["Módulo 1 — O Começo: "+caps+" descomplicado — o mínimo que você precisa saber para começar com o pé direito",
        "Módulo 2 — A Base: "+(seed%10+10)+" técnicas fundamentais que "+(seed%7+85)+"% dos iniciantes ignoram e depois se arrependem",
        "Módulo 3 — A Virada: como aplicar "+low+" em situações reais — "+["cases","exemplos","exercícios"][seed%3]+" práticos",
        "Módulo 4 — O Refinamento: "+(seed%3+3)+" ajustes finos que separam o amador do profissional em "+low,
        "Módulo 5 — O Domínio: técnicas avançadas de "+caps+" + plano de evolução contínua"],
      ]},
    { emoji:"▦", nome:"Guia Definitivo de "+caps, sufixo:"",
      descS:"Referência completa e prática de "+low,
      template:(a,s,b,p) => [
        a+" — "+s,
        b+" com referência completa, exemplos reais e passo a passo",
        p+" — "+validados[1],
        "Se você pudesse ter apenas UM recurso sobre "+low+", este guia é tudo que você precisa. "+(seed%10+20)+" páginas de conteúdo denso, direto e aplicável. Sem enrolação. Cada capítulo foi testado e validado por "+(seed%10+100)+" pessoas antes de ir para o guia. É o que funciona — ponto.",
        "Enquanto você se perde em informações soltas, quem tem o guia resolve "+low+" em minutos.",
        "O guia que você consulta uma vez e usa para sempre.",
        ["Capítulo 1 — "+caps+" Explicado: o essencial em "+(seed%3+3)+" páginas — sem teoria desnecessária, só o que importa",
        "Capítulo 2 — "+["Ferramentas Essenciais","Técnicas Fundamentais","O Passo a Passo"][seed%3]+": guia prático ilustrado com "+(seed%5+5)+" exemplos reais",
        "Capítulo 3 — "+["Os Erros Clássicos","Problemas Comuns","Desafios Frequentes"][seed%3]+": "+((seed%5)+5)+" situações resolvidas passo a passo em "+low,
        "Capítulo 4 — "+["Resultados Reais","Cases de Sucesso","Aplicações Práticas"][seed%3]+": "+((seed%3)+3)+" histórias de quem aplicou e transformou o resultado",
        "Capítulo 5 — "+["Glossário","Referências","Próximos Passos"][seed%3]+": tudo que você precisa para continuar evoluindo em "+caps],
      ]},
    { emoji:"▸", nome:"Fórmula "+caps, sufixo:"",
      descS:"Sistema direto e eficiente para "+low,
      template:(a,s,b,p) => [
        a+" — "+s,
        b+" com a fórmula que elimina tentativa e erro",
        p+" — "+validados[1],
        "A "+a+" não é mais um curso. É uma fórmula. Você insere seu esforço, segue os "+(seed%3+3)+" passos e obtém o resultado. Parece simples porque é. Enquanto outros métodos te vendem complexidade, a Fórmula te entrega um sistema testado e calibrado por "+(seed*3+50)+" iterações com alunos reais.",
        "Enquanto você tenta "+(seed%2?"métodos complicados":"receitas milagrosas")+" para "+low+", quem usa a fórmula já tem resultado em "+(seed%4+3)+" semanas.",
        "Simples, direto e testado — a fórmula que transforma seu esforço em resultado.",
        ["Passo 1 — "+caps+" Descomplicado: o "+(seed%5+3)+" conceitos que você precisa entender para aplicar a fórmula",
        "Passo 2 — "+["Diagnóstico","Preparação","Configuração"][seed%3]+": "+((seed%3)+4)+" ajustes iniciais que determinam "+(seed%6+80)+"% do seu resultado",
        "Passo 3 — Execução da Fórmula: o protocolo de "+(seed%5+7)+" dias com ações diárias de "+((seed%5)*5+10)+" minutos",
        "Passo 4 — "+["Ajuste Fino","Otimização","Correção de Rota"][seed%3]+": como identificar e corrigir os desvios em "+(seed%4+2)+" dias",
        "Passo 5 — "+["Escala","Automação","Rotina de Alto Desempenho"][seed%3]+": levando a fórmula de "+low+" ao próximo nível"],
      ]},
  ];

  const arq = ARQ[seedIdx];
  const pDores = ["você se sente perdido","não sabe por onde começar","já tentou e não deu certo","acha que não é para você","perde tempo com informações soltas","começa e para na primeira dificuldade","acha complicado demais"];
  const pBenefs = ["resultado rápido e consistente","aprender sem sofrer","dominar em poucos dias","ver resultado antes do esperado","ter um caminho claro e testado","finalmente conseguir fazer dar certo","transformar sua relação com"];
  const pTransform = ["dominar "+low+" com confiança","ter resultado consistente toda semana","acordar sabendo exatamente o que fazer","ver a transformação acontecer mais rápido que imaginava"];
  const pBenefObj = [low+" em "+(seed%4+3)+" semanas",caps+" — do zero ao resultado","resultado em "+low+" sem estresse",caps+" com "+["qualidade","confiança","consistência","liberdade"][seed%4]];

  const [hl, sb, bf] = arq.template(arq.nome, arq.descS, "Resultado garantido", caps);
  const headline = hl;
  const sub = sb;
  const benef = bf;
  const hook1 = "Você já pensou em "+low+" e não sabia por onde começar? O "+arq.nome+" é a resposta.";
  const hook2 = "Enquanto você "+pDores[seed%pDores.length]+", "+validados[0].split("—")[0].trim()+" já "+pBenefs[seed%pBenefs.length]+" com este método.";
  const hook3 = "Imagine "+pTransform[seed%pTransform.length]+". O "+arq.nome+" é o caminho mais curto para chegar lá.";
  const sp = arq.template(arq.nome, arq.descS, validados[0].split("—")[0].trim(), caps)[3];
  const mods = arq.template(arq.nome, arq.descS, "", caps)[6];

  const criativos = [
    "Card problema: 'Você também "+pDores[seed%pDores.length]+"?' — gatilho de identificação imediata",
    "Antes/depois conceitual: como era antes de "+low+" vs como fica depois do "+arq.nome,
    seed%2?"Story mostrando 'Os "+(seed%4+3)+" erros que matam seu resultado em "+low+"'":"Vídeo curto explicando o método em 30 segundos com resultado real",
    "Depoimento simulado: '"+(seed%2?"Nunca achei que conseguiria":"Pensei que era difícil demais")+" — em "+(seed%3+2)+" semanas tudo mudou'",
    "Infográfico: o passo a passo do "+arq.nome+" — "+(seed%3+3)+" etapas para "+low+" definitivo",
  ];

  const entregaveis = [
    mods[0],
    mods[1],
    mods[2],
    seed%2?"Planilha de acompanhamento diário":"Checklist de "+(seed%5+10)+" itens essenciais",
    seed%2?"Acesso ao grupo privado de alunos":"Bônus: "+caps+" — o guia rápido de "+(seed%3+7)+" páginas",
  ];

  const name = arq.nome + (arq.sufixo ? " — "+arq.sufixo : "");
  const desc = arq.descS+" — "+validados[0].split("—")[0].trim();

  const pix = seed*13+7;
  const lucroFallback = 60000;
  return {
    id:"p"+seed, emoji:arq.emoji, name,
    desc, validated:validados.join(" — "),
    headline, sub, benef,
    hook1, hook2, hook3,
    mods, criativos, salesPage:sp, entregaveis,
    vsl: {
      abertura_gancho: "Voce ja sentiu que poderia estar vivendo muito melhor? Que algo esta faltando?",
      problema: "A verdade e que a maioria das pessoas passa anos tentando mudar e nunca consegue. Elas comecam, param, comecam de novo. O ciclo se repete porque falta um metodo, nao motivacao.",
      solucao: "O "+arq.nome+" e o metodo que elimina a tentativa e erro. Sao "+((seed%4)+3)+" pilares testados que levam voce do ponto A ao ponto B sem desvio. Cada passo foi calibrado por milhares de alunos antes de voce.",
      prova_social: validados[0].split("—")[0].trim()+" ja transformaram o resultado usando exatamente este metodo. Os dados sao reais: "+validados[1],
      oferta: "Por tempo limitado, voce leva o "+arq.nome+" completo com todos os bonus por apenas 12x de R$ "+(19+pix/10)+",90. Acesso vitalicio, atualizacoes gratis e garantia de 7 dias.",
      cta: "Clique no botao abaixo, faca sua matricula e comece hoje mesmo. Em "+(seed%4+3)+" semanas voce vai olhar para tras e agradecer por ter comecado.",
      script_completo: "[ABERTURA - 5s] Voce ja sentiu que poderia estar vivendo muito melhor? Que algo esta faltando? [PAUSA] [PROBLEMA - 20s] A verdade e que a maioria das pessoas passa anos tentando mudar e nunca consegue. Elas comecam, param, comecam de novo. O ciclo se repete porque falta um metodo, nao motivacao. [SOLUCAO - 40s] O "+arq.nome+" e o metodo que elimina a tentativa e erro. Sao "+((seed%4)+3)+" pilares testados que levam voce do ponto A ao ponto B sem desvio. Cada passo foi calibrado por milhares de alunos antes de voce. [PROVA SOCIAL - 20s] "+validados[0].split("—")[0].trim()+" ja transformaram o resultado usando exatamente este metodo. Os dados sao reais: "+validados[1]+" [OFERTA - 30s] Por tempo limitado, voce leva o "+arq.nome+" completo com todos os bonus por apenas 12x de R$ "+(19+pix/10)+",90. Acesso vitalicio, atualizacoes gratis e garantia de 7 dias. [CTA - 10s] Clique no botao abaixo, faca sua matricula e comece hoje mesmo."
    },
    anuncios_plataformas: {
      instagram: { ideia: "Reels de 30s mostrando o problema que o produto resolve. Texto na tela com a promessa principal. CTA no final para o link da bio.", imagem: "Take direto com criador olhando para camera. Cenario simples e bem iluminado. Texto sobreposto com a headline em destaque.", prompt: "Crie uma imagem de um Reels do Instagram mostrando uma pessoa em ambiente domestico bem iluminado, olhando para a camera com expressao de realizacao. Texto na tela: headline do produto em letras garrafais brancas com sombra. Fundo neutro e clean." },
      facebook: { ideia: "Carrossel de 5 slides: Slide 1 problema, Slide 2 solucao, Slide 3 prova social, Slide 4 oferta, Slide 5 CTA.", imagem: "Card limpo com fundo claro, foto de pessoa realizada no canto, headline em destaque, bullet points dos beneficios.", prompt: "Crie um card de anuncio para Facebook com fundo bege claro. No canto esquerdo, foto de pessoa sorrindo. A direita, headline em negrito, 3 bullets de beneficios e CTA em destaque." },
      google: { ideia: "Anuncio de busca com headline que atrai pelo problema. Subtitulo com a solucao. Extensoes de sitelinks para modulos.", imagem: "Landing page limpa com headline no topo, video de apresentacao, beneficios em grid e CTA abaixo.", prompt: "Crie uma landing page simples com fundo claro, headline no topo em letra grande, espaco para video incorporado ao centro, grade de 3 colunas com icones e beneficios, e um botao de CTA em destaque na parte inferior." },
      tiktok: { ideia: "Video de 15s com dica rapida relacionada ao tema do produto. Gancho nos primeiros 2 segundos.", imagem: "Video vertical com pessoa comum em ambiente real. Texto na tela sincronizado com a fala. Edicao rapida e dinamica.", prompt: "Descreva uma cena de video vertical TikTok: pessoa em ambiente real (sala ou escritorio) falando diretamente para a camera. Iluminacao natural. Texto na tela com a frase de impacto. Edicao com cortes rapidos." },
    },
    plano_conteudo: {
      semana_1: [
        { dia:1, formato:"Reels", tema:"Apresentacao do problema que o produto resolve", roteiro:"[ABERTURA] Voce sabia que [problema] atinge milhares de pessoas? [DESENVOLVIMENTO] Pois e, eu tambem achava que nao tinha solucao ate descobrir [solucao]. [FECHAMENTO] Salva esse video para ver depois e segue a gente para mais dicas." },
        { dia:2, formato:"Post Estatico", tema:"Os 3 maiores mitos sobre o tema", roteiro:"Mito 1: [mito comum]. Verdade: [verdade]. Mito 2: [outro mito]. Verdade: [outra verdade]. Mito 3: [terceiro mito]. Verdade: [terceira verdade]. Qual desses mitos voce ja acreditou? Comenta aqui." },
        { dia:3, formato:"Carrossel", tema:"Passo a passo para comecar hoje", roteiro:"Slide 1: Capa com '5 passos para comecar hoje'. Slide 2: Passo 1 — [descricao]. Slide 3: Passo 2 — [descricao]. Slide 4: Passo 3 — [descricao]. Slide 5: Passo 4 — [descricao]. Slide 6: Passo 5 — [descricao]. Slide 7: CTA — 'Salve este carrossel e compartilhe com quem precisa.'" },
        { dia:4, formato:"Reels", tema:"Depoimento de aluno que transformou o resultado", roteiro:"[ABERTURA] Conheca a historia do [nome]. [MEIO] Ele/a tambem enfrentava [problema] e achava que nao tinha jeito. [FIM] Depois do metodo, [resultado]. Isso prova que qualquer um pode conseguir." },
        { dia:5, formato:"Post Estatico", tema:"Dica rapida de implementacao", roteiro:"Dica de ouro: [dica pratica]. A maioria das pessoas ignora isso, mas faz toda a diferenca. Teste hoje e me conta o resultado nos comentarios." },
        { dia:6, formato:"Carrossel", tema:"Comparacao antes e depois com dados reais", roteiro:"Slide 1: 'Antes vs Depois' em destaque. Slide 2: Antes — [situacao anterior com dados]. Slide 3: Depois — [situacao posterior com dados]. Slide 4: O que mudou — [principais mudancas]. Slide 5: Como voce tambem pode conseguir — [CTA]." },
        { dia:7, formato:"Reels", tema:"Pergunta para engajar e conhecer o publico", roteiro:"[PERGUNTA] Me diz nos comentarios: qual a maior dificuldade que voce enfrenta com [tema]? [CONTEXTO] Eu ja passei por isso e vou te ajudar a resolver. [CTA] Segue a gente para mais." },
      ],
      semana_2: [
        { dia:8, formato:"Reels", tema:"Por que a maioria desiste antes de ver resultado", roteiro:"[ABERTURA] Sabe por que 80% das pessoas desistem antes de ver resultado? [MEIO] Porque elas esperam mudanca instantanea. O segredo e a consistencia. [FIM] Quer saber o metodo que mantem voce no caminho mesmo quando a motivacao acaba?" },
        { dia:9, formato:"Post Estatico", tema:"Frase inspiradora com call to action", roteiro:"[FRASE] 'O resultado mais impressionante vem da consistencia, nao da intensidade.' — [Autor]. [REFLEXAO] Voce tem sido consistente ou so intenso? [CTA]Comenta 'EU' se voce quer ser mais consistente." },
        { dia:10, formato:"Carrossel", tema:"Erros que estao sabotando seu resultado", roteiro:"Slide 1: '7 erros que estao sabotando seu resultado'. Slide 2: Erro 1 e solucao. Slide 3: Erro 2 e solucao. Slide 4: Erro 3 e solucao. Slide 5: Erro 4 e solucao. Slide 6: Erro 5 e solucao. Slide 7: 'Pare de cometer esses erros. O metodo resolve todos.'" },
        { dia:11, formato:"Reels", tema:"Demonstracao pratica de uma tecnica do metodo", roteiro:"[DEMONSTRACAO] Hoje vou te mostrar na pratica como aplicar [tecnica]. [PASSO A PASSO] Primeiro [acao 1], depois [acao 2], por ultimo [acao 3]. [RESULTADO] Simples, ne? Isso e so uma amostra do que tem no metodo completo." },
        { dia:12, formato:"Post Estatico", tema:"Pergunta para gerar conversa nos comentarios", roteiro:"[PERGUNTA] Qual dessas frases mais combina com voce hoje? A) 'Vou comecar segunda-feira' B) 'Nao sei por onde comecar' C) 'Ja estou fazendo e quero acelerar' D) 'Preciso de um guia' [CONTEXTO] Sua resposta define qual conteudo voce precisa. Me conta ai." },
        { dia:13, formato:"Carrossel", tema:"Resumo dos principais aprendizados da semana", roteiro:"Slide 1: 'Resumo da semana — 7 aprendizados'. Slide 2-8: cada slide com um aprendizado chave. Slide 9: 'Salve este resumo para consultar sempre que precisar.'" },
        { dia:14, formato:"Reels", tema:"Convite final para conhecer o metodo completo", roteiro:"[GANCHO] Se voce chegou ate aqui, e porque realmente quer transformar seu resultado. [OFERTA] O metodo completo esta esperando por voce. Sao [X] modulos que levam voce do zero ao resultado. [CTA] Link na bio para comecar hoje. Nao adie mais." },
      ],
    },
    oferta_precificacao: {
      valor_ideal: "R$ "+(47+pix*2)+",00 a vista ou 12x de R$ "+(4+Math.round(pix*2/12))+","+(90+seed%9)+" — preco ancorado no valor percebido de R$ "+(197+pix*5)+",00 com base nos resultados entregues e comparacao com benchmarks do mercado.",
      ancoragem: "De R$ "+(197+pix*5)+",00 por apenas R$ "+(47+pix*2)+",00 a vista — economia de "+(Math.round((1-(47+pix*2)/(197+pix*5))*100))+"% em relacao ao valor real. Preco de lancamento por tempo limitado.",
      parcelamento: "12x de R$ "+(4+Math.round(pix*2/12))+","+(90+seed%9)+" sem juros no cartao de credito. Tambem aceitamos boleto bancario e PIX com "+["5%","10%","7%"][seed%3]+" de desconto.",
      garantia: "7 dias de garantia incondicional. Se por qualquer motivo voce nao ficar satisfeito, devolvemos 100% do seu dinheiro sem perguntas. Risco zero para voce.",
      escassez: "Ultimas "+(30-seed)+" vagas com acesso aos bonus exclusivos. O preco vai aumentar quando atingirmos "+(200+seed*10)+" alunos. Garanta seu acesso agora antes que acabe.",
      oferta_principal: "O "+arq.nome+" e um curso completo com "+((seed%4)+5)+" modulos, mais de "+(5+seed*3)+" horas de conteudo, acesso vitalicio e atualizacoes gratuitas. Voce leva tambem: Bonus 1 — Guia Rapido de "+caps+" (PDF de "+((seed%5)+15)+" paginas), Bonus 2 — Checklist de Implementacao em "+(seed%5+7)+" Dias, Bonus 3 — Grupo VIP de Alunos no Telegram, Bonus 4 — Acesso a todas as atualizacoes futuras. Tudo por apenas R$ "+(47+pix*2)+",00. Garantia de 7 dias. Comece hoje."
    },
    funil_automacao: {
      checkout: "Kiwify ou Hotmart como plataforma de checkout. Recomendamos Kiwify para produtos nacionais (taxa de 8,5% + R$ 1,50) com split de pagamento automatico e integracao com Email Marketing. Configuracao em 30 minutos.",
      order_bump: "Checklist de "+caps+" em "+((seed%5)+7)+" Dias — oferta de R$ "+(9+seed*3)+",90 no checkout. Gatilho: 'Adicione por apenas R$ "+(9+seed*3)+",90 para acelerar seus resultados em "+(seed%4+2)+"x.'",
      upsell: "Mentoria Individual de "+((seed%5)+3)+" Sessoes com o criador — oferta pos-compra de R$ "+(97+pix*4)+",90. Inclui sessoes ao vivo de 30min, plano personalizado e suporte direto no WhatsApp.",
      downsell: "Se recusar o upsell, oferecer: Versao Plus do "+arq.nome+" com "+(seed%3+2)+" modulos extras por apenas R$ "+(37+pix)+",90. Apenas 3x sem juros.",
      emails_pos_venda: "Dia 1: Boas-vindas com link de acesso e primeiros passos. Dia 3: Dica de ouro para comecar bem. Dia 7: Checklist de progresso e oferta de upsell. Dia 14: Case de aluno que transformou resultado. Dia 30: Pesquisa de satisfacao e convite para o grupo VIP. Emails escritos em tom acolhedor e direto, com CTA para acao.",
      whatsapp: "Sequencia automatizada no ManyChat ou SendPulse: Dia 1 — link de acesso e video de boas-vindas. Dia 4 — dica pratica em audio. Dia 10 — convite para o grupo VIP. Dia 21 — oferta de mentoria. Tudo com tags para segmentacao.",
      recuperacao_carrinho: "Sequencia de 3 emails: Email 1 (1h apos abandono) — 'Voce deixou algo para tras' com link direto para o checkout. Email 2 (24h) — depoimento de aluno. Email 3 (72h) — oferta de desconto de "+["10%","15%","20%"][seed%3]+" por tempo limitado.",
      automacao_visao_geral: "Checkout no Kiwify com order bump + upsell + downsell. Apos compra: disparo automatico de email de boas-vindas e acesso a area de membros. Sequencia de 5 emails de nutriacao. Tag no WhatsApp para suporte. Grupo VIP no Telegram. Carrinho abandonado recuperado com 3 emails e oferta de desconto. Funil completo configurado."
    },
    escala_monetizacao: {
      trafego_pago: "Facebook Ads + Instagram Ads como plataformas principais. Orcamento inicial de R$ 30-50/dia. Segmentacao por interesses e lookalike de compradores. Meta: CAC abaixo de R$ "+(20+seed*5)+",00 com ROAS minimo de 3:1. Escalar conforme rentabilidade.",
      afiliados: "Programa de afiliados na Kiwify ou HeroSpark com comissao de "+(30+seed%10)+"% + bonus por performance. Plataforma com checkout integrado, links unicos e pagamento automatico. Recrutamento via Instagram e grupos de afiliados.",
      indicacao: "Programa de indicacao: aluno que indica ganha "+(10+seed%10)+"% de comissao nas vendas dos indicados por 6 meses. Incentivo adicional: acesso gratuito a proxima turma para quem indicar "+(seed%3+3)+" alunos pagantes.",
      recorrencia: "Assinatura mensal de R$ "+(17+pix/5)+",90 para acesso ao clube de conteudo exclusivo: lives semanais, modulos novos a cada mes, template atualizados e suporte prioritario no WhatsApp.",
      assinatura: "Clube "+caps+" — R$ "+(17+pix/5)+",90/mes com: 1 modulo novo por mes, sessao ao vivo semanal, templates exclusivos e comunidade vip. Cancelamento facil a qualquer momento.",
      licenciamento: "Licenca para usar o conteudo com seus proprios clientes: R$ "+(497+pix*10)+",00 para licenca basica (revenda simples) ou R$ "+(997+pix*20)+",00 para licenca master (inclui direitos de modificacao e branding proprio).",
      white_label: "White label completo: R$ "+(1997+pix*30)+",00. Voce recebe todo o conteudo sem marcacao da marca, pode rebrandear e vender como seu. Inclui suporte para configuracao e manual de uso.",
      franquia_digital: "Franquia digital do metodo: R$ "+(4997+pix*50)+",00. Inclui white label, programa de afiliados proprio, copy prontas, funis configurados e suporte de 6 meses para lancamento.",
      metricas: ["CAC: R$ "+(15+seed*3)+",00 (custo de aquisicao por cliente via anuncios)", "LTV: R$ "+(120+pix*5)+",00 (valor medio do cliente ao longo de 12 meses)", "ROAS: "+(3+seed%3)+":1 (retorno sobre investimento em anuncios)", "ROI: "+(200+seed*30)+"% (retorno sobre investimento total)", "Taxa de conversao: "+(2+seed%4)+"."+(seed%10)+"% (media da pagina de vendas)"]
    },
    dashboard_operacao: {
      receita_projetada: "R$ "+lucroFallback.toLocaleString("pt-BR")+"/mes — projecao realista baseada em ticket medio de R$ "+(47+pix*2)+",00 e "+(Math.ceil(lucroFallback/(47+pix*2)))+" vendas por mes. Considera ciclo de vendas de 30 dias e sazonalidade do nicho.",
      meta_mensal: Math.ceil(lucroFallback/(47+pix*2))+" vendas por mes para atingir a receita projetada. Media de "+(Math.ceil(lucroFallback/(47+pix*2)/30))+" vendas por dia. Meta semanal: "+Math.ceil(lucroFallback/(47+pix*2)/4)+" vendas.",
      ticket_medio: "R$ "+(47+pix*2)+",00 — ticket medio esperado considerando o bundle basico + upsell de "+(30+seed%20)+"% dos compradores. Ticket com upsell: R$ "+(47+pix*2+Math.round((47+pix*2)*0.3))+",00.",
      conversao: "2."+(seed%10)+"% a 4."+((seed*7)%10)+"% — taxa de conversao estimada da pagina de vendas para trafego frio. Para trafego quente (seguidores): 5% a 10%. Baseado em benchmarks do mercado digital 2026.",
      cac: "R$ "+(15+seed*3)+",00 (custo de aquisicao por cliente) — calculado com base em CPM medio de R$ "+(8+seed%5)+",00 e taxa de conversao de "+(2+seed%4)+"% do clique a venda. Meta de reducao: R$ "+(10+seed*2)+",00 em 90 dias.",
      roi: (200+seed*30)+"% de retorno sobre investimento nos primeiros 90 dias. Calculo: (receita gerada — investimento total) / investimento total * 100. Considera gastos com anuncios, plataforma e ferramentas.",
      escala: "1. Aumentar orcamento de trafego pago em "+(20+seed*10)+"% a cada 15 dias mantendo ROAS acima de 3:1. 2. Expandir programa de afiliados com contratacao de "+(5+seed*3)+" super-afiliados. 3. Criar versao plus do produto para aumentar ticket medio. 4. Lancar em novos nichos relacionados. 5. Implementar recorrencia com clube de assinatura. 6. Explorar parcerias com influenciadores do nicho."
    },
    proximo_produto: {
      ideia: "Versao Avancada do "+arq.nome+" — "+caps+" para quem ja domina o basico e quer resultados profissionais. Preco sugerido: R$ "+(97+pix*4)+",00. Completa o ecossistema de produtos do zero ao avancado.",
      linha_produtos: ["Produto 1 — Entry: "+arq.nome+" (R$ "+(47+pix*2)+",00) — para iniciantes que querem o primeiro resultado.", "Produto 2 — Medio: "+caps+" Avancado (R$ "+(97+pix*4)+",00) — para quem ja completou o basico e quer se aprofundar.", "Produto 3 — Premium: Mentoria "+caps+" (R$ "+(497+pix*10)+",00) — acompanhamento individualizado com sessoes semanais."],
      cross_sell: "Ao comprar o "+arq.nome+", oferecer: (1) "+caps+" Avancado com "+["20%","25%","30%"][seed%3]+" de desconto. (2) Mentoria "+caps+" com condicao especial de "+(3+seed%3)+"x sem juros. (3) Combinado completo (Entry + Medio + Premium) por R$ "+(497+pix*10 - 50)+",00 (economia de "+(Math.round((1-(497+pix*10-50)/(497+pix*10+97+pix*4+47+pix*2))*100))+"%).",
      ascensao_valor: "Entry (R$ "+(47+pix*2)+",00) → Medio (R$ "+(97+pix*4)+",00) → Premium (R$ "+(497+pix*10)+",00). Cada nivel oferece mais profundidade, suporte e resultados. Estrategia: entregar tanto valor no entry que o cliente QUER comprar o proximo nivel."
    },
    ia_otimizadora: {
      analise_anuncios: "Anuncios atuais estao performando dentro da media do mercado. Recomendacoes: (1) Testar 3 variacoes de headline por semana. (2) Aumentar orcamento nos criativos com maior CTR. (3) Criar oferta especifica para lookalike de compradores. (4) Implementar CAPI para melhorar rastreamento. (5) Testar formato de anuncio em carrossel vs video.",
      analise_vsl: "VSL atual tem potencial mas pode otimizar: (1) Gancho nos primeiros 3 segundos precisa ser mais impactante. (2) Secao de prova social deve vir antes da oferta. (3) Reduzir tempo total para "+(3+seed%2)+" minutos. (4) Adicionar legendas para visualizacao sem som. (5) Incluir selo de garantia visivel durante toda a oferta.",
      analise_pagina: "Pagina de vendas pode melhorar: (1) Adicionar contador regressivo para gerar urgencia. (2) Incluir mais 3 depoimentos em video. (3) Adicionar secao de perguntas frequentes. (4) Botao de CTA deve ficar fixo no scroll. (5) Testar versao com video vs versao so texto.",
      analise_funil: "Funil apresenta oportunidades: (1) Taxa de abandono de carrinho de "+(30+seed%20)+"% — implementar email de recuperacao em 1h. (2) Order bump com taxa de aceitacao baixa — testar nova oferta. (3) Upsell com baixa conversao — reduzir preco ou adicionar mais valor. (4) Falta nutricao para leads que nao compram — criar sequencia de 7 dias.",
      melhorias_auto: "Melhorias sugeridas: (1) Automatizar nutricao de leads com sequencia de emails de 7 dias. (2) Implementar chatbot no WhatsApp para suporte pre-venda. (3) Criar pagina de obrigado com upsell embedado. (4) Configurar disparo automatico de recibo e acesso. (5) Taggear compradores por interesse para ofertas futuras.",
      testes_ab: "Testes A/B sugeridos: (1) Headline A vs Headline B na pagina de vendas. (2) CTA 'Comprar Agora' vs 'Quero Meu Acesso'. (3) Preco unico vs parcelamento destacado. (4) Video vs Imagem no anuncio de topo de funil. (5) Pagina longa vs pagina curta com video."
    },
  };
}

const VITRINE = [
  { id:"v1", emoji:"◇", name:"Desafio Corpo de Verão 21 Dias",
    idea:"Transformação corporal feminina em casa — treinos de 15 minutos, sem academia, sem restrição alimentar. Resultados visíveis na primeira semana. Método validado por 8.400 mulheres que transformaram o corpo sem sair de casa.",
    headline:"21 dias para você se olhar no espelho e amar o que vê",
    sub:"Protocolo de treinos de 15min/dia que já transformou 8.400 mulheres",
    benef:"Resultados visíveis em 7 dias — 93% das alunas mantêm após o desafio",
    criativos:[
      "ANTES E DEPOIS REAL — Sequência de 3 cards: foto da aluna antes do desafio, foto na semana 2, foto no dia 21. Legenda: 'Da dúvida ao orgulho em 21 dias. Sem academia, sem restrição. Só consistência. Quer o passo a passo? Link na bio.'",
      "VÍDEO TREINO EM CASA — Reels de 30s mostrando treino completo em time-lapse: agachamento, prancha, polichinelo, alongamento. Texto na tela: '15 minutos. Sem equipamento. Sem academia. Resultado real.' Legenda: 'O melhor treino é o que você faz. Esse leva 15 min e transforma.'",
      "STORY PRATO DO DIA — Sequência de 3 stories: café da manhã (ovos + fruta + café), almoço (proteína + salada + arroz integral), jantar (sopa ou salada com proteína). Legenda: 'Sem dieta maluca. Comida de verdade, no seu ritmo. O cardápio completo está no desafio.'",
      "DEPOIMENTO EM VÍDEO — Clipe de 45s: aluna sentada em ambiente natural. 'Eu achava que precisava de 2h de academia todo dia. No desafio aprendi que 15 minutos bem feitos mudam tudo. Perdi 4kg, ganhei disposição e autoestima. Se eu consegui, você consegue.'",
      "RANKING EXERCÍCIOS — Card com ranking vertical: 'Os 7 exercícios que mais queimam gordura em casa'. 1. Burpee (12 cal/min), 2. Pular corda (11 cal/min), 3. Agachamento (8 cal/min), 4. Prancha (5 cal/min), 5. Polichinelo (8 cal/min), 6. Mountain Climber (9 cal/min), 7. Jumping Jack (7 cal/min). Fundo: foto de mulher treinando em casa."
    ],
    salesPage:"Chega de promessas vazias. O Desafio Corpo de Verão é um protocolo de 21 dias criado por uma educadora física com 12 anos de experiência. São treinos de 15 minutos — sem equipamento, sem academia, sem loucura. Enquanto você segue o passo a passo, milhares de mulheres já estão transformando o corpo na sala de casa. Resultado garantido ou seu dinheiro de volta. Bônus exclusivo: Guia Alimentar Simplificado com cardápio semanal. Comece hoje e em 21 dias você se olha no espelho e ama o que vê.",
    entregaveis:["21 treinos em vídeo (5-15 min cada) — aula gravada em qualidade HD com demonstração e correção dos movimentos. Cada treino tem aquecimento, exercício principal e alongamento. Download liberado imediatamente.","Guia nutricional simplificado (1 página) — cardápio semanal flexível com opções de café, almoço, lanche e jantar. Sem alimentos restritos, sem contagem de calorias. Foco em comida de verdade e porções adequadas.","Checklist diário de hábitos — planner semanal para marcar: treino concluído, água (2L), sono 7h+, refeições no horário. Versão digital editável e versão para imprimir. Acompanhamento visual da consistência.","Grupo exclusivo no WhatsApp por 21 dias — suporte diário da educadora física. Posts matinais com dica do dia. Encontros ao vivo semanais para tirar dúvidas. Networking com outras alunas. Mantido ativo por 21 dias corridos.","E-book: 'Como manter o resultado após o desafio' — 30 páginas com plano de manutenção: treinos reduzidos (3x/semana), ajustes alimentares para o dia a dia, como evitar o efeito sanfona, checklist de hábitos sustentáveis para manter o corpo e a saúde após os 21 dias."]},
  { id:"v2", emoji:"▦", name:"Método de Leitura Dinâmica",
    idea:"Sistema completo para ler 1 livro por semana com compreensão total — mesmo que você só tenha 15 minutos por dia. Técnica validada por neurocientistas que reprograma seu cérebro para processar texto em alta velocidade.",
    headline:"Leia 1 livro por semana — mesmo que você só tenha 15 minutos por dia",
    sub:"Técnica validada por neurocientistas — 12 mil alunos em 27 países",
    benef:"Sua velocidade de leitura dobra em 7 dias — e você absorve mais do que antes",
    criativos:[
      "COMPARAÇÃO ANTES/DEPOIS — Card em linha do tempo: '2025: 3 livros lidos no ano inteiro' seta '2026: 1 livro por semana — 52 livros em 12 meses'. Abaixo: 'Média de 15 min/dia. Resultado confirmado por 12 mil alunos.'",
      "TÉCNICA EM AÇÃO — Reels de 45s mostrando a técnica de escaneamento visual: tela dividida com olhos seguindo linhas em velocidade progressiva. Texto na tela: 'Seu olho já sabe ler rápido. Seu cérebro precisa aprender a acompanhar.'",
      "INFOGRAFICO CÉREBRO — Ilustração do cérebro com áreas destacadas: 'Córtex visual processa 20x mais informações que o sistema auditivo. A leitura dinâmica ativa áreas de reconhecimento de padrões que ficam adormecidas na leitura tradicional.'",
      "DEPOIMENTO LEITORA — Depoimento em card: 'Lia 1 livro por ano. Hoje leio 1 por semana. O método mudou minha relação com a leitura. Agora leio antes de dormir, no ônibus, na fila. 15 minutos que transformaram minha cabeça.'",
      "CARD PERGUNTA IMPACTANTE — Card minimalista: 'Quantos livros você deixou de ler esse ano?' no centro. Abaixo: 'O problema não é seu tempo. É seu método. 12 mil alunos resolveram isso em 7 dias.'"
    ],
    salesPage:"Você não tem tempo de ler — você tem um método errado. O Método de Leitura Dinâmica ensina seu cérebro a processar texto em alta velocidade sem perder compreensão. Cientificamente comprovado, usado por executivos, estudantes e concurseiros. Em 7 dias sua velocidade dobra. O curso inclui 12 videoaulas objetivas, app de treino diário de 5 minutos e planilha de progresso. Você começa devagar e acelera progressivamente. No final, 1 livro por semana vira rotina. Garantia de 7 dias: se não sentir diferença na sua leitura, devolvemos seu dinheiro.",
    entregaveis:["12 videoaulas (módulos de 20 min) — cada aula aborda uma técnica específica: escaneamento visual, eliminação de subvocalização, ampliação do campo periférico, leitura por blocos, compreensão acelerada, leitura seletiva, skimming, scanning, leitura crítica, memorização, revisão espaçada e consolidação. Aulas em HD com exercícios práticos ao final de cada uma.","App web de treino diário (5 min/dia) — plataforma online com exercícios progressivos de velocidade e compreensão. Métricas em tempo real: palavras por minuto, taxa de compreensão, tempo total de leitura. Histórico de evolução semanal. Acesso por qualquer dispositivo.","Planilha de progresso de velocidade — Google Sheets com gráfico automático de evolução. Registro semanal de: palavras por minuto, livros concluídos, minutos de treino por dia, taxa de compreensão nos testes. Inclui metas personalizadas por semana.","PDF com 10 exercícios de fixação — material complementar para praticar sem depender do computador. Exercícios de: ampliação de campo visual, leitura vertical, leitura em zigue-zague, blocos de palavras, eliminação de regressão. Cada exercício com instrução, exemplo e espaço para prática.","Certificado de conclusão — certificado digital nominal com carga horária de 40 horas. Assinado pelo instrutor. Válido como atividade complementar. Link verificável. Disponível para download imediato após conclusão do curso."]},
  { id:"v3", emoji:"✦", name:"Glow Up — Maquiagem Profissional",
    idea:"Método completo de maquiagem profissional para iniciantes absolutas. Aprenda a fazer uma make de influencer em 10 minutos usando apenas 5 pincéis e produtos que você já tem em casa. 37 tutoriais do básico ao avançado.",
    headline:"Parece que você gastou horas — mas levou só 10 minutos",
    sub:"Método de maquiagem profissional para quem nunca pegou num pincel",
    benef:"Make de influencer em 10 min — 37 tutoriais em vídeo do zero ao resultado profissional",
    criativos:[
      "TELA DIVIDIDA ANTES/DEPOIS — Reels com tela dividida: lado esquerdo 'sem make' (rosto natural), lado direito '10 minutos depois' (maquiagem completa com o método). Texto na tela: '5 pincéis. 10 minutos. Um glow que ninguém acredita que você fez sozinha.'",
      "TIME-LAPSE MAKE — Vídeo acelerado de 60s mostrando a make completa do início ao fim: pele, sobrancelha, olhos, contorno, boca. Cada etapa com legenda do produto usado. Final: resultado pronto com luz natural.",
      "CARD 3 PINCEIS — Card comparativo: '15 pincéis' (riscado) seta '3 pincéis essenciais'. Abaixo: '1. Kabuki (base), 2. Esfumado (sombra), 3. Chanfrado (contorno). Com eles você faz 90% dos looks. O curso te ensina como.'",
      "TRUQUE CONTORNO 30s — Reels vertical mostrando o truque do contorno em 30 segundos: '3 pontos: têmpora, abaixo da maçã do rosto, mandíbula. Esfuma pra baixo com movimento circulares. Pronto. Parece que você passou horas.'",
      "DEPOIMENTO GLOW UP — Card com foto da aluna antes/depois: 'Nunca soube fazer nada. Achava que maquiagem era coisa de profissional. Com 7 dias de método, minha amiga perguntou quem tinha feito minha make. Eu respondi: fui eu.'"
    ],
    salesPage:"Você não precisa de 50 produtos. Precisa de 5 e da técnica certa. O Glow Up é o método que transforma iniciantes em profissionais em 7 dias. 37 tutoriais em vídeo, do básico ao avançado. Produtos que você já tem em casa. Cada aula tem menos de 20 minutos e você pratica junto. Em uma semana você faz uma make completa que ninguém acredita que foi você mesma. Bônus: Guia dos 5 Pincéis Essenciais (você descobre que 3 resolvem 90% dos looks), Lista de Produtos Baratos vs Profissionais (economia de até 70%). Garantia de 7 dias. Comece hoje e amanhã você já faz sua primeira make completa.",
    entregaveis:["37 aulas em vídeo (5-20 min) — organizadas em 5 módulos: Pele Perfeita (base, corretivo, pó), Sobrancelhas (design, preenchimento, correção), Olhos (sombra, delineado, cílios), Contorno e Iluminação (rosto, nariz, lábios), Looks Completos (dia, noite, casamento, trabalho). Cada aula com PDF resumo.","Guia dos 5 pincéis essenciais — e-book ilustrado com fotos de cada pincel, para que serve, como usar, movimento correto, limpeza e conservação. Inclui tabela de substituição: 'se não tiver esse, use esse outro' com 3 alternativas por pincel.","E-book: 'Maquiagem para cada formato de rosto' — guia visual com 8 formatos de rosto (oval, redondo, quadrado, coração, longo, losango, triângulo, retângulo). Para cada formato: onde aplicar contorno, iluminador e blush. Fotos passo a passo e esquemas.","Lista de produtos baratos vs profissionais — tabela comparativa com 30 produtos: nome, marca barata (R$ 10-30), marca profissional (R$ 60-150), diferença real, onde comprar. Atualizada trimestralmente. Economia média de R$ 200 no kit inicial.","Grupo VIP para dúvidas ao vivo — comunidade no Telegram com a instrutora. Sessão de tira-dúvidas ao vivo 1x por semana. Desafios semanais de make com feedback. Networking com outras alunas. Conteúdo exclusivo: dicas rápidas toda quarta-feira."]},
  { id:"v4", emoji:"◎", name:"Ansiedade Zero — Kit de Autocuidado",
    idea:"Kit completo de gestão de ansiedade e estresse baseado em TCC e mindfulness. 37 exercícios práticos em áudio e vídeo que você usa no momento da crise ou como prevenção diária. 22 mil usuárias. Resultado clínico comprovado em 2 semanas.",
    headline:"5 minutos por dia para desligar o piloto automático",
    sub:"Kit prático de autocuidado baseado em TCC e mindfulness — 22 mil usuárias",
    benef:"Sua ansiedade diminui 40% em 2 semanas — estudos clínicos comprovam",
    criativos:[
      "GRAFICO ANTES/DEPOIS — Card com gráfico de linha: 'Nível de ansiedade (escala 1-10)'. Semana 1: 8.5. Semana 2: 6.2. Semana 3: 5.0. Semana 4: 4.1. Abaixo: 'Estudo clínico com 200 participantes. Redução média de 40% em 14 dias.'",
      "EXERCICIO RESPIRATORIO — Reels de 60s: exercício respiratório guiado em tempo real. 'Inspira pelo nariz contando até 4. Segura 7 segundos. Expira pela boca contando até 8. Repete 3 vezes.' Texto na tela: 'Isso ativa seu sistema nervoso parassimpático. Sua frequência cardíaca cai em segundos.'",
      "DEPOIMENTO CRISE — Card com depoimento: 'Minha ansiedade vinha em ondas. No trabalho, no ônibus, antes de dormir. Com a técnica dos 5 minutos, aprendi a reconhecer o gatilho e acalmar antes da crise. Hoje controlo em 3 minutos. Não é milagre — é técnica.'",
      "INFOGRAFICO CEREBRO — Ilustração do cérebro com setas: 'Amígdala (alarme) fica hiperativa na ansiedade. Mindfulness reduz atividade da amígdala e fortalece o córtex pré-frontal (controle). Você não elimina a ansiedade — você aprende a regulá-la.'",
      "CARD TÉCNICA — Card minimalista: 'Não é calmante. É técnica.' Abaixo: '7 técnicas baseadas em TCC + 30 exercícios guiados. Para usar no momento da crise ou todo dia como prevenção. Resultado em 2 semanas.'"
    ],
    salesPage:"A ansiedade não é fraqueza — é um alarme que não desliga. O kit Ansiedade Zero te dá as ferramentas para desligar esse alarme em 5 minutos. Baseado em TCC e mindfulness, validado por psicólogos. São 37 exercícios práticos em áudio e vídeo que você usa no momento da crise ou como prevenção diária. Cada exercício tem menos de 15 minutos. Você começa pelo diagnóstico: identifica seus gatilhos, aprende a reconhecer os sinais físicos da ansiedade e aplica a técnica certa para cada situação. Resultado comprovado em estudos clínicos: redução de 40% dos sintomas em 14 dias. Inclui 2 meditações guiadas para dormir, planilha de registro de humor e e-book sobre comer emocional. Garantia de 7 dias: se não sentir diferença, devolvemos.",
    entregaveis:["37 exercícios guiados em áudio (3-15 min) — divididos em 4 categorias: Crise (5 exercícios para momentos agudos, com duração de 3-5 min), Diário (15 exercícios de manutenção, 10 min cada), Sono (7 exercícios para dormir, 15 min), Avançado (10 exercícios de aprofundamento, 12 min). Todos em MP3 com voz guiada e versão sem voz.","2 meditações guiadas para dormir — áudios de 20 e 30 minutos com música de fundo. Meditação 1: 'Body Scan' — varredura corporal progressiva para relaxamento profundo. Meditação 2: 'Visualização Guiada' — cenário calmo e seguro para adormecer. Ambas com opção de despertar suave ao final.","Planilha de registro de humor semanal — Google Sheets editável com campos: humor (escala 1-5), nível de ansiedade (1-10), gatilho identificado, técnica usada, eficácia (1-5). Gráfico automático de evolução. Inclui versão para imprimir. Ajuda a identificar padrões e o que funciona para você.","E-book: 'Comer emocional — como identificar e lidar' — 25 páginas com: os 7 sinais de fome emocional vs física, diário alimentar emocional (template incluso), 10 estratégias para interromper o ciclo, receitas de 'comida afetiva' saudável, exercícios de autoconsciência alimentar.","Acesso vitalício — atualizações grátis para sempre. Novos exercícios adicionados trimestralmente. Acesso a comunidade exclusiva. Participação em lives mensais sobre saúde mental. Material atualizado conforme novas pesquisas."]},
  { id:"v5", emoji:"$", name:"Renda Extra com Canva",
    idea:"Método completo para criar e vender designs no Canva — mesmo sem saber desenhar. Roteiro passo a passo do zero ao primeiro pagamento. 5.600 alunas faturando em marketplaces como Elo7, Shopee e Gumroad.",
    headline:"Ganhe R$ 500 a R$ 3.000/mês vendendo designs que você faz em 15 min",
    sub:"Método testado — 5.600 alunas ativas vendendo em marketplaces",
    benef:"Sem experiência, sem estoque, sem investimento — só o Canva grátis",
    criativos:[
      "TELA DIVIDIDA — Reels 30s com tela dividida: lado esquerdo 'Design feito em 15 minutos' (mostrando criação no Canva em speed), lado direito 'Quanto vendeu no mês passado' (print de vendas: R$ 1.847). Texto: '15 minutos de trabalho. Vendido 23 vezes. R$ 47 cada. Conta simples.'",
      "CRIAÇÃO CANVA SPEED — Vídeo time-lapse de 60s: criação completa de um produto digital no Canva (template para Instagram). Mostrando escolha de template, edição de texto, troca de cores, exportação. Legenda: 'Do zero ao produto pronto em 15 minutos. Sem Photoshop. Sem saber desenhar. Só o Canva grátis.'",
      "CARD PRODUTOS QUE MAIS VENDEM — Card listando: 'Os 5 produtos digitais que mais vendem em 2026'. 1. Templates para Instagram (R$ 29-97). 2. Planners semanais (R$ 19-47). 3. E-books curtos (R$ 27-67). 4. Checklists profissionais (R$ 9-27). 5. Kits de design (R$ 47-147). Abaixo: 'Todos feitos no Canva grátis.'",
      "DEPOIMENTO ALUNA — Card com foto: 'Faturei R$ 2.300 no meu primeiro mês. Eu não sabia nem fazer um círculo no Canva quando comecei. O método é passo a passo. Cada aula você cria um produto que já pode vender. Em 30 dias eu tinha 12 produtos na loja.'",
      "INFOGRAFICO ZERO AO PRIMEIRO — Infográfico vertical com 5 passos: 1. Escolha seu nicho (teste grátis incluso). 2. Crie seu primeiro produto (15 min, template incluso). 3. Publique no marketplace (guias das 5 maiores plataformas). 4. Precifique certo (planilha de precificação). 5. Receba seu primeiro pagamento (meta: 7 dias)."
    ],
    salesPage:"Você não precisa saber desenhar. Não precisa de Photoshop. Não precisa de estoque. Com o Canva grátis e este método, você cria produtos digitais que vendem em marketplaces como Elo7, Shopee e Gumroad. 5.600 alunas já estão faturando. O curso é 100% passo a passo: você assiste a aula, abre o Canva do lado e cria junto. Cada aula termina com um produto pronto para publicar. Em 30 dias você tem uma loja com 10+ produtos. Inclui 50 templates Canva prontos (só editar e vender), lista dos 10 marketplaces que mais vendem em 2026, planilha de precificação e grupo de alunas para networking. Garantia de 7 dias. Comece hoje, comece do zero.",
    entregaveis:["15 videoaulas (10-25 min) — módulos: 1. Canva do Zero (interface, atalhos, truques essenciais), 2. Nichos Lucrativos (como pesquisar e escolher), 3. Criação de Produtos (5 tipos diferentes passo a passo), 4. Marketplaces (cadastro, publicação, otimização em cada plataforma), 5. Precificação (quanto cobrar por produto e por pacote), 6. Vendas e Atendimento (como lidar com clientes e reembolsos), 7. Escala (como criar mais produtos em menos tempo).","50 templates Canva prontos — 10 templates por categoria: Planners (semanal, mensal, financeiro), E-books (capa + 5 páginas internas), Posts Instagram (citação, tutorial, promoção), Checklists (viagem, limpeza, estudos, organização), Kits (combo planner + checklist + e-book). Todos editáveis: troque texto, cor e imagens. Prontos para publicar.","Lista dos 10 marketplaces que mais vendem em 2026 — análise completa: Elo7 (taxas, público, produtos mais vendidos), Shopee (como criar loja, anúncios grátis), Gumroad (venda direta, assinatura), Hotmart (produtos digitais), Monetizze, Eduzz, Kiwify, Cartpanda, Payhip, Sellfy. Para cada um: prós, contras, taxa, tempo para receber, tutorial de cadastro.","Planilha de precificação — Google Sheets com cálculo automático de: custo por produto, margem de lucro, preço sugerido por marketplace, preço mínimo, preço recomendado para lançamento. Inclui pesquisa de concorrência integrada: cole o link do concorrente e veja a faixa de preço do mercado.","Grupo de alunas para networking — comunidade no WhatsApp com mais de 5.600 alunas. Dicas diárias de produtos que estão vendendo bem. Alertas de oportunidades sazonais. Feedbacks de produtos antes de publicar. Parcerias entre alunas. Sorteios mensais de templates."]},
  { id:"v6", emoji:"△", name:"Corredor Iniciante — 5km em 30 Dias",
    idea:"Protocolo intervalado criado por fisioterapeuta para começar a correr do zero. Método dos 30 dias que começa com 1 minuto de trote e chega a 5km contínuos. Sem sofrimento, sem lesão, sem desistência. 18 mil alunos.",
    headline:"Do sofá aos 5km em 30 dias — sem falta de ar, sem desistir",
    sub:"Protocolo intervalado criado por fisioterapeuta — 18 mil alunos",
    benef:"Na 2ª semana você já corre 10 min sem parar — na 4ª, 5km completos",
    criativos:[
      "GRAFICO PROGRESSÃO — Card com gráfico de barras mostrando evolução semanal: Semana 1 (1 min trote + 2 min caminhada x 5), Semana 2 (3 min trote + 1 min caminhada x 4), Semana 3 (8 min trote + 2 min caminhada x 3), Semana 4 (20 min corrida contínua). Texto: '30 dias. 4 semanas. Do zero aos 5km.'",
      "TECNICA RESPIRACAO — Reels 45s: demonstração da técnica de respiração correta ao correr. Instrutor correndo em câmera lenta. 'Inspira em 3 passadas. Expira em 2 passadas. Isso evita ponto de lado e falta de ar. Parece simples — muda tudo.'",
      "CARD 5 ERROS — Card listando: '5 erros que fazem você desistir de correr'. 1. Começar muito rápido (pace inicial errado). 2. Ignorar o aquecimento (lesão certa). 3. Prender a respiração (falta de ar). 4. Tênis inadequado (dor no joelho). 5. Comparar com os outros (frustração). Abaixo: 'O método corrige todos.'",
      "DEPOIMENTO CORREDOR — Card com foto de antes/depois (antes: sedentário, depois: correndo na praia): 'Nunca corri na vida. Literalmente. Minha maior distância era do sofá até a geladeira. Hoje completo 5km sem parar. Se você me dissesse isso há 30 dias, eu não acreditaria.'",
      "STORY TREINO REAL — Reels de 60s: criador do método mostrando um treino real de 20 min. Mostra o cronômetro, a respiração controlada, o pace estável. Final: '20 minutos. 3.2km. Iniciante absoluto. Isso é possível porque seu corpo se adapta mais rápido que você imagina.'"
    ],
    salesPage:"Seu corpo foi feito pra correr. Você só nunca aprendeu direito. O método dos 30 dias começa com 1 minuto — literalmente. Um minuto de trote, um de caminhada. Enquanto você repete o ciclo, seu coração e pulmão se adaptam. No dia 30, você completa 5km sem parar. Cada treino é guiado por áudio — você só coloca o fone e segue. Sem sofrimento, sem lesão, sem desistência. Inclui 30 treinos em áudio guiado, planilha de progressão semanal, vídeos de alongamento e aquecimento. Criado por fisioterapeuta especializado em corrida. 18 mil alunos já completaram o desafio. Comece hoje. Em 30 dias você corre 5km.",
    entregaveis:["30 treinos em áudio guiado — um treino por dia, cada um com duração de 15 a 35 minutos (progressivo). Áudio com voz do instrutor que dita quando correr, quando caminhar, como respirar. Música de fundo motivacional. Dias de descanso incluídos no cronograma. Formato MP3, compatível com qualquer celular.","Planilha de progressão semanal — planilha interativa (Google Sheets) com: treino do dia, duração, distância estimada, pace, frequência cardíaca alvo, nível de esforço percebido (escala 1-10). Gráfico automático de evolução semanal. Metas personalizadas por nível: iniciante, intermediário, avançado.","Vídeos de alongamento e aquecimento — 5 vídeos em HD (5-15 min cada): aquecimento pré-corrida (dinâmico), alongamento pós-corrida (estático), liberação miofascial com rolo, fortalecimento para corredores (joelho e tornozelo), mobilidade de quadril e tornozelo.","E-book: 'Nutrição para corredor iniciante' — 20 páginas com: o que comer antes de correr (2h, 1h, 30min antes), hidratação durante o treino, recuperação pós-treino (janela de 30 min), suplementos que realmente funcionam (e os que não funcionam), receitas rápidas para corredores (5 refeições pré e pós treino).","Grupo de corrida no Strava — clube exclusivo no Strava para alunos. Rankings semanais amigáveis. Desafios de distância mensais. Feedbacks dos treinos. Dicas diárias. Eventos presenciais (quando disponíveis). Networking com outros corredores iniciantes de todo o Brasil."]},
  { id:"v7", emoji:"◎", name:"Planner Financeiro 2026",
    idea:"Sistema de 4 passos para organizar suas finanças pessoais e sair do vermelho. Mapeie, corte, organize e multiplique seu dinheiro. 14 mil pessoas organizaram as contas e reduziram dívidas com este método comprovado.",
    headline:"Pare de passar sufoco no fim do mês — em 30 dias você sabe pra onde vai cada real",
    sub:"Método de 4 passos que já ajudou 14 mil pessoas a organizar as contas",
    benef:"Em 7 dias você identifica 3 gastos invisíveis — em 30 dias sua dívida reduz 50%",
    criativos:[
      "ANTES/DEPOIS EXTRATO — Card comparativo: extrato bagunçado (várias compras pequenas, juros, tarifas, parcelas espalhadas) vs extrato organizado com categorias coloridas e saldo positivo. Texto: 'A diferença não é quanto você ganha. É como você organiza.'",
      "VIDEO GASTO DELIVERY — Reels 45s: 'Como eu descobri que gastava R$ 400 por mês com delivery'. Abre o app de banco, mostra histórico de pedidos do mês. Calcula total. 'Eram 3 pedidos por semana. Média de R$ 35 cada. 12 pedidos por mês = R$ 420. Isso é R$ 5.040 por ano. Em 30 dias eu cortei pela metade.'",
      "CARD PLANILHA QUE MUDA — Card: 'A planilha que mudou minha relação com dinheiro'. Imagem da planilha com categorias coloridas e gráficos. 'Quando você vê pra onde cada real vai, o comportamento muda. Não é sobre cortar tudo — é sobre escolher onde gastar.'",
      "DEPOIMENTO QUITAR DIVIDA — Card: 'Saí de R$ 12 mil em dívidas para R$ 0 em 8 meses'. 'Eu achava que precisava ganhar mais. Mas o problema não era a renda — era a organização. O método dos 4 passos me mostrou onde estava vazando dinheiro. Em 8 meses estava livre.'",
      "INFOGRAFICO PARA ONDE VAI — Infográfico em pizza: 'Onde seu dinheiro realmente vai'. 35% moradia, 20% alimentação, 15% transporte, 10% lazer, 10% dívidas, 5% assinaturas, 5% outros. Abaixo: 'A maioria das pessoas não sabe. Depois do planner, você sabe exatamente.'"
    ],
    salesPage:"Você não ganha mal — você gasta mal. O Planner Financeiro não é só uma planilha. É um método de 4 passos: Mapear (registre cada centavo por 7 dias), Cortar (identifique os 3 gastos invisíveis que mais pesam), Organizar (categorize e defina limites por área), Multiplicar (direcione o excedente para investimentos ou quitação de dívidas). Usado por 14 mil pessoas. Em 30 dias você sabe exatamente pra onde vai cada real — e sobra no fim do mês. Inclui planilha interativa no Google Sheets, e-book com os 4 passos detalhados, 10 desafios financeiros semanais, calculadora de juros de dívida e acesso ao grupo privado no Telegram. Garantia de 7 dias. Seu dinheiro não precisa ser um mistério.",
    entregaveis:["Planilha interativa (Google Sheets/Excel) — 7 abas: Dashboard (visão geral com gráficos automáticos), Receitas (registro e categorização), Despesas (categorias fixas e variáveis), Dívidas (controle de parcelas e juros), Metas (economia por objetivo), Investimentos (acompanhamento de aportes), Extrato Mensal (resumo do mês fechado). Cores personalizáveis. Fórmulas automáticas.","E-book: '4 passos para sair do vermelho' — 40 páginas com: diagnóstico financeiro (calcule seu patrimônio líquido), passo 1 (mapeamento de 7 dias — template incluso), passo 2 (como identificar gastos invisíveis — 5 categorias que passam despercebidas), passo 3 (método dos envelopes digital — como organizar sem sofrer), passo 4 (estratégias para multiplicar — da reserva ao investimento).","10 desafios financeiros semanais — um desafio por semana para transformar hábitos: Semana 1 (registre tudo), Semana 2 (corte 1 gasto supérfluo), Semana 3 (cozinhe em casa 3x), Semana 4 (negocie 1 conta), Semana 5 (crie 1 fonte extra), Semana 6 (quite a menor dívida), Semana 7 (invista R$ 50), Semana 8 (faça 1 mês sem delivery), Semana 9 (revise assinaturas), Semana 10 (monte sua reserva).","Calculadora de juros de dívida — ferramenta no Google Sheets: insira valor da dívida, taxa de juros mensal, parcelas restantes. Calcule: total de juros que pagará, quanto economiza pagando antecipado, melhor ordem para quitar dívidas (método avalanche vs neve), simulação de renegociação.","Acesso ao grupo privado no Telegram — comunidade com 14 mil membros. Dicas diárias de educação financeira. Desafios coletivos. Tira-dúvidas com o criador. Planilhas compartilhadas. Mutirões de renegociação de dívidas. Conteúdo exclusivo toda semana."]},
  { id:"v8", emoji:"▸", name:"Inglês em 3 Meses — Método da Imersão",
    idea:"Método de imersão digital para aprender inglês do zero com foco em conversação real. 90 dias de conteúdo intensivo que substituem meses de escola tradicional. 31 mil alunos em 15 países. Fale inglês sem traduzir na cabeça.",
    headline:"Fale inglês em 3 meses — mesmo que você nunca tenha passado do 'hello'",
    sub:"Método de imersão digital — 31 mil alunos em 15 países",
    benef:"Em 30 dias você já mantém uma conversa de 5 minutos — sem traduzir na cabeça",
    criativos:[
      "ANTES/DEPOIS ALUNO — Reels com clipe de aluno na semana 1 vs semana 12. Semana 1: 'My name is... uh... I... uh...' (travando, gaguejando). Semana 12: mesmo aluno falando fluentemente por 30 segundos sobre seu trabalho. Texto na tela: '12 semanas. 15 min por dia. Do zero à conversa real.'",
      "TECNICA IMERSAO — Reels 45s: 'A técnica de imersão que substitui intercâmbio'. Mostra o método: 30 min de conteúdo em inglês todo dia (vídeos, podcasts, músicas) + 15 min de prática ativa (falando sozinho, gravando áudio). 'Seu cérebro aprende por exposição, não por regras. Imersão digital = intercâmbio sem sair de casa.'",
      "CARD ESCOLA TRADICIONAL VS MÉTODO — Card comparativo: 'Escola tradicional: traduzir na cabeça, gramática decorada, vergonha de falar, 2 anos para sair do básico'. 'Método da Imersão: pensa em inglês, aprende por contexto, fala desde o dia 1, 3 meses para conversar.'",
      "DEPOIMENTO ENTREVISTA — Card: 'Passei em 3 entrevistas de emprego depois do método'. 'Meu inglês era básico. Sempre travava na hora de falar. Em 3 meses de método, fiz entrevista totalmente em inglês e passei. Hoje trabalho com time internacional. O método mudou minha carreira.'",
      "INFOGRAFICO IMERSAO — Infográfico: '30 min de imersão equivalem a 2h de aula tradicional'. Mostra: comparação de retenção (imersão 80% vs aula tradicional 30%), áreas do cérebro ativadas (imersão ativa mais regiões), progressão mensal (imersão 3x mais rápida)."
    ],
    salesPage:"Escola tradicional te ensina a traduzir, não a falar. O Método da Imersão te mergulha no inglês real desde o primeiro dia. São 90 dias de conteúdo — vídeos, áudios, exercícios e desafios diários. Você não estuda inglês — você vive inglês. O método funciona em 3 pilares: Imersão Passiva (30 min/dia de conteúdo em inglês: filmes, séries, podcasts, música), Prática Ativa (15 min/dia falando sozinho, gravando áudio, repetindo frases), Correção Inteligente (feedback automático com IA sobre pronúncia e gramática). 31 mil alunos em 15 países já provaram que funciona. Sem decoreba, sem gramática chata, sem vergonha de falar. Resultado: em 30 dias você mantém uma conversa de 5 minutos. Em 90 dias, você fala com confiança. Inclui 90 videoaulas, app de vocabulário, sessões ao vivo e certificado. Garantia de 7 dias.",
    entregaveis:["90 aulas em vídeo (10-30 min cada) — organizadas em 12 semanas temáticas: Semana 1-2 (Fundamentos: apresentação, números, cores, família), Semana 3-4 (Rotina: trabalho, casa, alimentação, transporte), Semana 5-6 (Viagem: hotel, restaurante, aeroporto, compras), Semana 7-8 (Carreira: reunião, e-mail, entrevista, networking), Semana 9-10 (Social: amigos, eventos, opiniões, sentimentos), Semana 11-12 (Fluência: debates, histórias, planos, sonhos). Cada aula com PDF de resumo e exercícios.","App de vocabulário com repetição espaçada — aplicativo web com mais de 2.000 palavras e frases organizadas por tema e nível. Sistema de repetição espaçada (SRS) que otimiza a memorização: revisa palavras no momento ideal antes do esquecimento. Estatísticas de progresso. Meta: 20 palavras novas por dia. Disponível no navegador e como PWA no celular.","5 sessões de conversação em grupo ao vivo — encontros semanais de 45 min em grupo (máx 6 alunos) com instrutor nativo ou bilíngue. Temas variados: apresentações, discussões, jogos de papel, simulações. Toda conversa é gravada para revisão posterior. Feedbacks individuais de pronúncia e gramática. Agendamento flexível.","PDF: '500 palavras mais usadas em conversas' — material de referência com as 500 palavras e frases mais frequentes em conversas do dia a dia em inglês. Organizadas por categoria: saudações (30), trabalho (80), casa (60), comida (50), viagem (70), sentimentos (40), compras (50), tecnologia (40), saúde (30), lazer (50). Cada palavra com: tradução, pronúncia (fonética), exemplo em frase, áudio (QR code).","Certificado de conclusão — certificado digital com carga horária de 120 horas. Nível de proficiência (A1 a B2 conforme progresso). Assinado pelo instrutor chefe. Verificável por QR code. Aceito como atividade complementar em faculdades e programas de intercâmbio. Disponível em português e inglês."]},
];

let S = { etapa:0, ideia:"", criacao:"", lucro:60000, ativado:false, produto:null };
function ld() { try { const r=localStorage.getItem("ativador_completo"); if(r){const p=JSON.parse(r);Object.assign(S,p)} }catch{} }
function sv() { localStorage.setItem("ativador_completo", JSON.stringify(S)); }
ld();
document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
document.getElementById("s"+S.etapa).classList.add("active");
updateProgress();

function goEtapa(n) {
  if (n===1) { S.ideia=""; S.criacao=""; S.ativado=false; S.produto=null; sv(); }
  if (n===2 && !document.getElementById("ideiaInput").value.trim()) { toast("Descreva sua ideia primeiro"); return; }
  if (n===3 && !document.getElementById("criacaoInput").value.trim()) { toast("Descreva como quer a comunicacao"); return; }
  if (n===2) S.ideia=document.getElementById("ideiaInput").value.trim();
  if (n===3) S.criacao=document.getElementById("criacaoInput").value.trim();
  S.etapa=n; sv();
  document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
  document.getElementById("s"+n).classList.add("active"); document.getElementById("s"+n).classList.add("fade-in");
  updateProgress();
  if (n===1) { document.getElementById("ideiaInput").value=""; document.getElementById("tbStep").textContent="Etapa 1"; }
  if (n===2) { document.getElementById("criacaoInput").value=S.criacao; document.getElementById("tbStep").textContent="Etapa 2"; }
  if (n===3) { document.getElementById("tbStep").textContent="Etapa 3"; document.getElementById("lucroInput").value=S.lucro; }
}

function updateProgress() {
  const p=document.getElementById("progressSteps");
  const d1=document.getElementById("ps1"), d2=document.getElementById("ps2"), d3=document.getElementById("ps3");
  const l1=document.getElementById("psl1"), l2=document.getElementById("psl2");
  if (S.etapa===0) { p.style.display="none"; document.getElementById("tbStep").textContent="Ativador"; return; }
  p.style.display="flex";
  d1.className="ps-item"; d2.className="ps-item"; d3.className="ps-item";
  l1.className="ps-line"; l2.className="ps-line";
  d1.classList.add("active"); d1.classList.add("done"); l1.classList.add("done");
  if (S.etapa>=2) { d2.classList.add("active"); d2.classList.add("done"); l2.classList.add("done"); }
  if (S.etapa>=3) { d3.classList.add("active"); d3.classList.add("done"); }
  if (S.etapa===2) { d3.classList.remove("done"); }
  if (S.etapa===1) { d2.classList.remove("done","active"); l1.classList.remove("done"); d2.classList.remove("done"); }
  document.getElementById("tbStep").textContent="Etapa "+S.etapa;
}

async function ativarCompleto() {
  const lucro=parseInt(document.getElementById("lucroInput").value)||60000;
  S.lucro=lucro; sv();
  document.getElementById("loadingOverlay").classList.add("active");
  try {
    const res=await fetch("/api/generate", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ideia:S.ideia, tom:S.criacao, lucro:S.lucro})
    });
    if (!res.ok) { const e=await res.json(); throw new Error(e.error||"Erro ao gerar produto"); }
    S.produto=await res.json();
    S.ativado=true; sv();
    goEtapa(4);
    document.getElementById("tbStep").textContent="✓ Ativado";
    updateProgress();
    renderResultado();
    launchConfetti();
  } catch(e) {
    toast("! "+e.message);
  } finally {
    document.getElementById("loadingOverlay").classList.remove("active");
  }
}

function renderResultado() {
  const p=S.produto||gerarProdutoViral(S.ideia||"Ensinar mulheres", S.criacao||"Simples e direto", S.etapa-1);
  document.getElementById("pgEmoji").textContent=p.emoji||"◇";
  document.getElementById("pgNome").textContent=p.name;
  document.getElementById("pgDesc").textContent=p.desc;
  document.getElementById("pgValid").textContent="✓ "+p.validated;

  const grid=document.getElementById("vitrineGrid");
  grid.innerHTML=VITRINE.map(v =>
    `<div class="vg-item" onclick="toggleVitrine('${v.id}')">
      <span class="vg-icon">${v.emoji}</span>
      <span class="vg-name">${v.name}</span>
      <span class="vg-valid">${v.idea}</span>
    </div>
    <div class="vitrine-detail" id="vd-${v.id}">
      <div class="vd-pasta" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open')">
        <span>◇ Ideia + Copy</span><span class="vd-arrow">▾</span>
      </div>
      <div class="vd-content vd-tab0"></div>
      <div class="vd-pasta" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open')">
        <span>◇ Criativos</span><span class="vd-arrow">▾</span>
      </div>
      <div class="vd-content vd-tab1"></div>
      <div class="vd-pasta" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open')">
        <span>▦ Página de Vendas</span><span class="vd-arrow">▾</span>
      </div>
      <div class="vd-content vd-tab2"></div>
      <div class="vd-pasta" onclick="event.stopPropagation();this.nextElementSibling.classList.toggle('open')">
        <span>□ Entregáveis</span><span class="vd-arrow">▾</span>
      </div>
      <div class="vd-content vd-tab3"></div>
    </div>`
  ).join("");

  // Atualiza o highlight com o primeiro produto da vitrine
  const vh=document.getElementById("vhValor");
  if (vh && VITRINE.length) vh.textContent=VITRINE[0].name+" — "+VITRINE[0].headline;

  // Gera conteúdo das pastas
  gerarConteudoPastas();
}

function togglePasta(id, el) {
  const content=document.getElementById(id);
  const isOpen=content.classList.contains("open");
  document.querySelectorAll(".pasta-content").forEach(c=>c.classList.remove("open"));
  if (!isOpen) content.classList.add("open");
}

function toggleStep(idx) {
  const body=document.getElementById("stepBody"+idx);
  const card=body.closest(".step-card");
  const arrow=card.querySelector(".step-arrow");
  const isOpen=body.classList.contains("open");
  body.classList.toggle("open");
  arrow.style.transform=isOpen?"rotate(0deg)":"rotate(180deg)";
}

const STEPS = [
  // Tab 1: Produto (0-7)
  { icon:"◎", title:"A Promessa", tab:0 },
  { icon:"□", title:"Produto Completo", tab:0 },
  { icon:"▦", title:"Entregáveis", tab:0 },
  { icon:"◇", title:"Bônus", tab:0 },
  { icon:"▦", title:"Página de Vendas", tab:0 },
  { icon:"►", title:"VSL — Script Completo", tab:0, optional:true },
  { icon:"☰", title:"Criativos e Anúncios", tab:0, optional:true },
  { icon:"▦", title:"Plano de Conteúdo 14 Dias", tab:0, optional:true },
  // Tab 2: Vendas (8-10)
  { icon:"$", title:"Oferta e Precificação", tab:1, optional:true },
  { icon:"↻", title:"Funil e Automação", tab:1, optional:true },
  { icon:"↑", title:"Escala e Monetização", tab:1, optional:true },
  // Tab 3: Operação (11-13)
  { icon:"▥", title:"Dashboard do Negócio", tab:2, optional:true },
  { icon:"→", title:"Próximo Produto", tab:2, optional:true },
  { icon:"✦", title:"IA Otimizadora", tab:2, optional:true },
];

function gerarConteudoPastas() {
  const ideia=S.ideia || "Ensinar mulheres empreendedoras a criarem conteúdos profissionais para o Instagram";
  const tom=S.criacao || "Comunicação simples, feminina e com foco em transformação prática";
  const p=S.produto||gerarProdutoViral(ideia, tom, S.etapa-1);

  const allStepsHtml = STEPS.map((s, i) => {

    let body = "";
    switch(i) {
      case 0:
        body =
          `<div class="sc-item"><span class="sc-label">▸ Headline</span><span class="sc-value">${esc(p.headline)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">▦ Subtítulo</span><span class="sc-value">${esc(p.sub)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Benefício Central</span><span class="sc-value">${esc(p.benef)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">✓ Prova Social</span><span class="sc-value">${esc(p.validated)}</span></div>`;
        break;
      case 1:
        body =
          `<div class="sc-item"><span class="sc-label">▦ Descrição</span><span class="sc-value">${esc(p.desc)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">▦ Módulos</div>`+
          (p.mods||[]).map((m,i) =>
            `<div class="sc-mod"><span class="sc-mod-num">Módulo ${i+1}</span><span class="sc-mod-name">${esc(m)}</span></div>`
          ).join("");
        break;
      case 2:
        body =
          `<div class="sc-subtitle">□ O que o cliente recebe</div>`+
          (p.entregaveis||[]).map((e,i) =>
            `<div class="sc-ent"><span class="sc-ent-num">${i+1}.</span><span>${esc(e)}</span></div>`
          ).join("");
        break;
      case 3:
        body =
          `<div class="sc-subtitle">△ Bônus Exclusivos</div>`+
          (p.criativos||[]).slice(0,4).map((_,i) =>
            `<div class="sc-mod"><span class="sc-mod-num">Bônus ${i+1}</span><span class="sc-mod-name">${[`Template de Copy para ${p.name}`,`Checklist de Lançamento Rápido`,`Grupo VIP de Alunos`,`Atualização Vitalícia`][i]}</span></div>`
          ).join("");
        break;
      case 4:
        body = `<div class="sc-text">${esc(p.salesPage)}</div>`;
        break;
      case 5: {
        const vsl = p.vsl;
        body =
          `<div class="sc-item"><span class="sc-label">► Abertura (Gancho)</span><span class="sc-value">${esc(vsl.abertura_gancho)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Problema</span><span class="sc-value">${esc(vsl.problema)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Solução</span><span class="sc-value">${esc(vsl.solucao)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">▦ Prova Social</span><span class="sc-value">${esc(vsl.prova_social)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">△ Oferta</span><span class="sc-value">${esc(vsl.oferta)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">▸ CTA</span><span class="sc-value">${esc(vsl.cta)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">▦ Script Completo</div>`+
          `<div class="sc-text">${esc(vsl.script_completo)}</div>`+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar script</button>`;
        break;
      }
      case 6: {
        const plat = p.anuncios_plataformas;
        const PLAT_KEYS = [
          { key:"instagram", icon:"◇", name:"Instagram" },
          { key:"linkedin", icon:"▦", name:"LinkedIn" },
          { key:"facebook", icon:"▦", name:"Facebook" },
          { key:"google", icon:"◎", name:"Google Ads" },
          { key:"tiktok", icon:"♪", name:"TikTok" },
        ];
        body =
          `<div class="sc-subtitle">☰ Hooks para Anúncios</div>`+
          `<div class="sc-anuncio"><span class="sc-an-tag">▸ Topo de Funil</span><span class="sc-an-copy">${esc(p.hook1)}</span></div>`+
          `<div class="sc-anuncio" style="border-left-color:var(--g2)"><span class="sc-an-tag">▦ Meio de Funil</span><span class="sc-an-copy">${esc(p.hook2)}</span></div>`+
          `<div class="sc-anuncio" style="border-left-color:var(--g3)"><span class="sc-an-tag">▸ Fundo de Funil</span><span class="sc-an-copy">${esc(p.hook3)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">◇ Criativos por Plataforma</div>`+
          PLAT_KEYS.map(pk => {
            const d = plat[pk.key];
            if (!d) return "";
            return `<div class="sc-plat">
              <div class="sc-plat-header"><span>${pk.icon}</span><span class="sc-plat-name">${pk.name}</span></div>
              <div class="sc-plat-body">
                <div class="sc-item"><span class="sc-label">◇ Ideia</span><span class="sc-value">${esc(d.ideia)}</span></div>
                <div class="sc-item"><span class="sc-label">□ Imagem</span><span class="sc-value">${esc(d.imagem)}</span></div>
                <div class="sc-prompt">${esc(d.prompt)}</div>
                <button class="step-copy" onclick="copiarPrompt(this)">▦ Copiar Prompt</button>
              </div>
            </div>`;
          }).join("");
        break;
      }
      case 7: {
        const plano = p.plano_conteudo;
        body = `<div class="sc-subtitle">▦ Semana 1</div>`+
          (plano.semana_1||[]).map(d =>
            `<div class="sc-dia">
              <div class="sc-dia-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="sc-dia-num">Dia ${d.dia}</span>
                <span class="sc-dia-formato">${d.formato}</span>
                <span class="sc-dia-tema">${esc(d.tema)}</span>
              </div>
              <div class="sc-dia-body"><div class="sc-dia-roteiro">${esc(d.roteiro)}</div></div>
            </div>`
          ).join("")+
          `<div class="sc-divider"></div><div class="sc-subtitle">▦ Semana 2</div>`+
          (plano.semana_2||[]).map(d =>
            `<div class="sc-dia">
              <div class="sc-dia-header" onclick="this.parentElement.classList.toggle('open')">
                <span class="sc-dia-num">Dia ${d.dia}</span>
                <span class="sc-dia-formato">${d.formato}</span>
                <span class="sc-dia-tema">${esc(d.tema)}</span>
              </div>
              <div class="sc-dia-body"><div class="sc-dia-roteiro">${esc(d.roteiro)}</div></div>
            </div>`
          ).join("")+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar plano</button>`;
        break;
      }
      case 8: {
        const of = p.oferta_precificacao;
        body =
          `<div class="sc-item"><span class="sc-label">$ Valor Ideal</span><span class="sc-value">${esc(of.valor_ideal)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Ancoragem</span><span class="sc-value">${esc(of.ancoragem)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Parcelamento</span><span class="sc-value">${esc(of.parcelamento)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">□ Garantia</span><span class="sc-value">${esc(of.garantia)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Escassez</span><span class="sc-value">${esc(of.escassez)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">△ Oferta Principal</div>`+
          `<div class="sc-text">${esc(of.oferta_principal)}</div>`+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar oferta</button>`;
        break;
      }
      case 9: {
        const fu = p.funil_automacao;
        body =
          `<div class="sc-mod" style="border-left:3px solid var(--g1)"><span class="sc-mod-num">◇ Checkout</span><span class="sc-mod-name">${esc(fu.checkout)}</span></div>`+
          `<div class="sc-mod" style="border-left:3px solid var(--g2)"><span class="sc-mod-num">□ Order Bump</span><span class="sc-mod-name">${esc(fu.order_bump)}</span></div>`+
          `<div class="sc-mod" style="border-left:3px solid var(--gold)"><span class="sc-mod-num">↑ Upsell</span><span class="sc-mod-name">${esc(fu.upsell)}</span></div>`+
          `<div class="sc-mod" style="border-left:3px solid var(--tx3)"><span class="sc-mod-num">↓ Downsell</span><span class="sc-mod-name">${esc(fu.downsell)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">▦ Automação de Marketing</div>`+
          `<div class="sc-item"><span class="sc-label">▦ E-mails Pós-Venda</span><span class="sc-value">${esc(fu.emails_pos_venda)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ WhatsApp</span><span class="sc-value">${esc(fu.whatsapp)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">↻ Recuperação de Carrinho</span><span class="sc-value">${esc(fu.recuperacao_carrinho)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">✦ Visão Geral</span><span class="sc-value">${esc(fu.automacao_visao_geral)}</span></div>`+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar funil</button>`;
        break;
      }
      case 10: {
        const es = p.escala_monetizacao;
        body =
          `<div class="sc-subtitle">◇ Canais de Aquisição</div>`+
          `<div class="sc-item"><span class="sc-label">☰ Tráfego Pago</span><span class="sc-value">${esc(es.trafego_pago)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Afiliados</span><span class="sc-value">${esc(es.afiliados)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">▸ Indicação</span><span class="sc-value">${esc(es.indicacao)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">✦ Modelos de Receita</div>`+
          `<div class="sc-item"><span class="sc-label">↻ Recorrência</span><span class="sc-value">${esc(es.recorrencia)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">▦ Assinatura</span><span class="sc-value">${esc(es.assinatura)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">▦ Licenciamento</span><span class="sc-value">${esc(es.licenciamento)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ White Label</span><span class="sc-value">${esc(es.white_label)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Franquia Digital</span><span class="sc-value">${esc(es.franquia_digital)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">▦ Métricas-Chave</div>`+
          (es.metricas||[]).map(m =>
            `<div class="sc-criativo"><span class="sc-cr-num">▦</span><span>${esc(m)}</span></div>`
          ).join("")+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar estratégia</button>`;
        break;
      }
      case 11: {
        const db = p.dashboard_operacao;
        body =
          `<div class="sc-item"><span class="sc-label">↑ Receita Projetada</span><span class="sc-value">${esc(db.receita_projetada)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◎ Meta Mensal</span><span class="sc-value">${esc(db.meta_mensal)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Ticket Médio</span><span class="sc-value">${esc(db.ticket_medio)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">▦ Taxa de Conversão</span><span class="sc-value">${esc(db.conversao)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">$ CAC (Custo de Aquisição)</span><span class="sc-value">${esc(db.cac)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">▦ ROI</span><span class="sc-value">${esc(db.roi)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">▸ Escala</div>`+
          `<div class="sc-text">${esc(db.escala)}</div>`+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar dashboard</button>`;
        break;
      }
      case 12: {
        const nx = p.proximo_produto;
        body =
          `<div class="sc-item"><span class="sc-label">◇ Ideia</span><span class="sc-value">${esc(nx.ideia)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">▦ Linha de Produtos</div>`+
          (nx.linha_produtos||[]).map((lp,i) =>
            `<div class="sc-mod"><span class="sc-mod-num">Produto ${i+1}</span><span class="sc-mod-name">${esc(lp)}</span></div>`
          ).join("")+
          `<div class="sc-divider"></div>`+
          `<div class="sc-item"><span class="sc-label">◇ Cross Sell</span><span class="sc-value">${esc(nx.cross_sell)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">↑ Ascensão de Valor</span><span class="sc-value">${esc(nx.ascensao_valor)}</span></div>`+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar plano</button>`;
        break;
      }
      case 13: {
        const ia = p.ia_otimizadora;
        body =
          `<div class="sc-subtitle">✦ Sugestões da IA</div>`+
          `<div class="sc-item"><span class="sc-label">☰ Anúncios</span><span class="sc-value">${esc(ia.analise_anuncios)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">► VSL</span><span class="sc-value">${esc(ia.analise_vsl)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">▦ Página de Vendas</span><span class="sc-value">${esc(ia.analise_pagina)}</span></div>`+
          `<div class="sc-item"><span class="sc-label">↻ Funil</span><span class="sc-value">${esc(ia.analise_funil)}</span></div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">▸ Melhorias Automáticas</div>`+
          `<div class="sc-text">${esc(ia.melhorias_auto)}</div>`+
          `<div class="sc-divider"></div>`+
          `<div class="sc-subtitle">◇ Testes A/B Sugeridos</div>`+
          `<div class="sc-text">${esc(ia.testes_ab)}</div>`+
          `<button class="step-copy" onclick="copiarStep(${i})">▦ Copiar análises</button>`;
        break;
      }
    }
    return `<div class="step-card">
      <div class="step-header" onclick="toggleStep(${i})">
        <span class="step-num">${i+1}</span>
        <span class="step-icon">${s.icon}</span>
        <span class="step-title">${s.title}</span>
        <span class="step-arrow">▾</span>
      </div>
      <div class="step-body" id="stepBody${i}">${body}</div>
    </div>`;
  });

  const stepsArray = allStepsHtml;
  document.getElementById("stepsList").innerHTML = stepsArray.filter((_,i)=>STEPS[i].tab===0).join("");
  document.getElementById("stepsListVendas").innerHTML = stepsArray.filter((_,i)=>STEPS[i].tab===1).join("");
  document.getElementById("stepsListOperacao").innerHTML = stepsArray.filter((_,i)=>STEPS[i].tab===2).join("");

  setTimeout(() => {
    toggleStep(0);
    const firstVenda = stepsArray.findIndex((h,i)=>STEPS[i].tab===1 && h);
    const firstOper = stepsArray.findIndex((h,i)=>STEPS[i].tab===2 && h);
    if (firstVenda>=0) toggleStep(firstVenda);
    if (firstOper>=0) toggleStep(firstOper);
  }, 300);
}

function switchTab(tab) {
  const map = { produto:"tabProduto", vendas:"tabVendas", operacao:"tabOperacao" };
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add("active");
  document.getElementById(map[tab]).classList.add("active");
}

function esc(s) { return String(s||"").replace(/[&<>"']/g, function(m) {
  return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];
}); }

function copiarStep(idx) {
  const body=document.getElementById("stepBody"+idx);
  const txt=body.textContent.trim();
  navigator.clipboard.writeText(txt).then(()=>toast("▦ Copiado!"));
}

function copiarPrompt(btn) {
  const el=btn.previousElementSibling;
  if (el && el.classList.contains("sc-prompt")) {
    navigator.clipboard.writeText(el.textContent.trim()).then(()=>toast("▦ Prompt copiado!"));
  }
}

function downloadEstrutura() {
  const ideia=S.ideia || "Ensinar mulheres empreendedoras a criarem conteudos profissionais para o Instagram";
  const tom=S.criacao || "Comunicacao simples, feminina e com foco em transformacao pratica";
  const lucro=S.lucro.toLocaleString("pt-BR");
  const p=S.produto||gerarProdutoViral(ideia, tom, S.etapa-1);

  const win = window.open("", "_blank");
  if (!win) { toast("Permita pop-ups para baixar o PDF"); return; }

  win.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${p.name} — Produto Completo</title>
<style>
@page { margin: 20mm 15mm; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; line-height: 1.5; font-size: 11px; padding: 20px; }
h1 { font-size: 22px; font-weight: 800; color: #4A2C16; margin-bottom: 4px; }
h2 { font-size: 15px; font-weight: 700; color: #8B5E3C; margin: 20px 0 8px; border-bottom: 2px solid #D9CEC2; padding-bottom: 4px; }
h3 { font-size: 12px; font-weight: 700; color: #6B4226; margin: 12px 0 4px; }
p { font-size: 10px; color: #333; line-height: 1.5; margin-bottom: 4px; }
strong { color: #1A1A1A; }
.tag { display: inline-block; background: #EDE6DC; color: #8B5E3C; padding: 2px 10px; border-radius: 12px; font-size: 9px; font-weight: 600; margin: 4px 0; }
.card { background: #F5EFE8; border: 1px solid #D9CEC2; border-radius: 8px; padding: 12px; margin: 6px 0; }
.section { margin: 4px 0; }
.mod-grid { display: grid; gap: 4px; margin: 6px 0; }
.mod-item { background: #EDE6DC; border: 1px solid #D9CEC2; border-radius: 6px; padding: 8px 10px; font-size: 10px; }
.mod-item strong { color: #6B4226; display: block; margin-bottom: 2px; }
.anuncio { border-left: 3px solid #8B5E3C; padding: 8px 10px; margin: 4px 0; background: #F5EFE8; border-radius: 0 6px 6px 0; }
.tag-an { font-size: 8px; color: #8B5E3C; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.bonus { background: #F5EFE8; border: 1px solid #D9CEC2; border-radius: 6px; padding: 8px 10px; margin: 4px 0; }
.bonus h4 { color: #6B4226; font-size: 11px; margin-bottom: 2px; }
pre { font-size: 9px; color: #5C5146; font-family: 'Courier New', monospace; line-height: 1.4; background: #EDE6DC; padding: 8px; border-radius: 4px; margin: 4px 0; }
.footer { text-align: center; font-size: 8px; color: #8A7A6A; margin: 20px 0 10px; border-top: 1px solid #D9CEC2; padding-top: 10px; }
.meta { font-size: 9px; color: #8A7A6A; margin: 2px 0; }
</style>
</head>
<body>

<h1>${p.name}</h1>
<p style="font-size:12px;font-weight:700;color:#333">${p.headline}</p>
<p class="meta">${p.sub}</p>
<div class="tag">${p.validated}</div>
<p class="meta">◎ ${ideia} &middot; ◇ ${tom}</p>

<h2>◎ Promessa</h2>
<div class="card">
<p style="font-size:12px;font-weight:700">${p.headline}</p>
<p>${p.sub}</p>
<p><strong>Beneficio:</strong> ${p.benef}</p>
<p style="margin-top:6px"><strong>Antes:</strong> Voce cria conteudo mas nao vende.</p>
<p><strong>Depois:</strong> Seu conteudo vende no automatico.</p>
<p style="margin-top:4px">✓ ${p.validated}</p>
</div>

<h2>□ Produto</h2>
<p>${p.desc}</p>
<div class="mod-grid">
${p.mods.map((m,i)=>'<div class="mod-item"><strong>Modulo '+(i+1)+'</strong>'+m+'</div>').join("\n")}
</div>

<h2>▦ Pagina de Vendas</h2>
<div class="card">
<p style="font-size:12px;font-weight:700">${p.headline}</p>
<p><strong>Subtitulo:</strong> ${p.sub}</p>
<p><strong>Prova social:</strong> ${p.validated.split("—")[0].trim()}</p>
<p><strong>CTA:</strong> ▸ QUERO MEU ACESSO AGORA</p>
</div>

<h2>☰ Anuncios</h2>
<div class="anuncio">
<div class="tag-an">Topo de Funil</div>
<p>"${p.hook1}"</p>
</div>
<div class="anuncio">
<div class="tag-an">Meio de Funil</div>
<p>"${p.hook2}"</p>
</div>
<div class="anuncio">
<div class="tag-an">Fundo de Funil</div>
<p>"${p.hook3}"</p>
</div>

<h2>△ Estrutura</h2>
<div class="section">
<p><strong>✦ Motor Pesado</strong> — produto/ + assets/</p>
<p><strong>✦ Estrutura do Produto</strong> — paginas/ (venda, obrigado, captura) + bonus/</p>
<p><strong>✦ Vitrine</strong> — anuncios/ + vercel.json</p>
</div>

<h2>△ Bonus</h2>
<div class="bonus"><h4>▸ Bonus 1 — Template de Copy Viral</h4><p>30 modelos de legenda para feed, stories e reels.</p></div>
<div class="bonus"><h4>▸ Bonus 2 — Checklist de Lancamento (5 dias)</h4><p>Nicho → Produto → Anuncios → Lancamento → Otimizacao.</p></div>
<div class="bonus"><h4>▸ Bonus 3 — Grupo VIP de Alunos</h4><p>Suporte direto, networking e conteudos semanais.</p></div>
<div class="bonus"><h4>▸ Bonus 4 — Atualizacao Vitalicia</h4><p>Novos modulos, templates e estrategias atualizados.</p></div>

<div class="footer">
▸ ${p.validated}<br>
◎ ${ideia}<br>
▦ Sistema Ativador Automatico de Produtos Virais — 2026
</div>

</body>
</html>`);
  win.document.close();
  win.focus();
  win.print();
  toast("↓ PDF enviado para impressao — escolha 'Salvar como PDF'");
}

function toggleVitrine(id) {
  const el=document.getElementById("vd-"+id);
  const isOpen=el.classList.contains("open");
  document.querySelectorAll(".vitrine-detail").forEach(c=>c.classList.remove("open"));
  if (!isOpen) {
    el.classList.add("open");
    if (!el._loaded) {
      const v=VITRINE.find(x=>x.id===id);
      if (v) {
        el.querySelector(".vd-tab0").textContent=gerarConteudoVitrine(v,0);
        el.querySelector(".vd-tab1").textContent=gerarConteudoVitrine(v,1);
        el.querySelector(".vd-tab2").textContent=gerarConteudoVitrine(v,2);
        el.querySelector(".vd-tab3").textContent=gerarConteudoVitrine(v,3);
        el._loaded=true;
      }
    }
  }
}

function gerarConteudoVitrine(v, tab) {
  if (tab===0) {
    return "◇ IDEIA\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"+v.idea+"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▸ COPY DA PROMESSA\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nHeadline: "+v.headline+"\nSubtítulo: "+v.sub+"\nBenefício: "+v.benef;
  }
  if (tab===1) {
    return "◇ CRIATIVOS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"+v.criativos.map((c,i)=>"  "+(i+1)+". "+c).join("\n")+"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▦ Dica: Use estes conceitos como inspiração para seus próprios criativos. Adapte o visual ao seu nicho.";
  }
  if (tab===2) {
    return "▦ PÁGINA DE VENDAS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"+v.salesPage+"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▸ CTA: QUERO MEU ACESSO AGORA\n$ Preço sugerido: R$ 47 a R$ 97\n↻ Garantia: 7 dias";
  }
  if (tab===3) {
    return "□ ENTREGÁVEIS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"+v.entregaveis.map((e,i)=>"  ✓ "+(i+1)+". "+e).join("\n")+"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▦ Validação: Produto real testado em mercado";
  }
  return "";
}

function gerarConteudoProduto(p, pasta) {
  const ideia=S.ideia || "Ensinar mulheres empreendedoras a criarem conteúdos profissionais para o Instagram";
  const tom=S.criacao || "Comunicação simples, feminina e com foco em transformação prática";
  if (pasta===0) {
    return "◎ A PROMESSA\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▸ "+p.headline+"\n▦ "+p.sub+"\n◇ "+p.benef+"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▦ Antes: conteúdo sem entrega, sem venda\n▸ Depois: produto que vende no automático\n✓ "+p.validated+"\n◎ "+ideia+"\n◇ "+tom;
  }
  if (pasta===1) {
    return "□ "+p.headline+"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▦ "+p.sub+"\n✓ "+p.validated+"\n◇ "+p.benef+"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n◎ "+ideia+"\n◇ "+tom+"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▦ 5 Módulos:\n"+p.mods.map((m,i)=>"  Módulo "+(i+1)+". "+m).join("\n");
  }
  if (pasta===2) {
    return "▦ PÁGINA DE VENDAS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▸ Headline: "+p.headline+"\n▦ "+p.sub+"\n✓ "+p.validated.split("—")[0].trim()+"\nCTA: ▸ QUERO MEU ACESSO AGORA\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n◇ OBRIGADO\n✓ Pagamento confirmado → área de membros\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n↓ CAPTURA\nIsca: Checklist \""+p.headline+"\"\nConversão: 15-30% leads qualificados";
  }
  if (pasta===3) {
    return "☰ TOPO DE FUNIL\n\""+p.hook1+"\"\nOrçamento: R$30-50/dia | Formato: Reels + Imagem\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n☰ MEIO DE FUNIL\n\""+p.hook2+"\"\nFormato: Carrossel 5 slides (9x + saves)\nCTA: ▸ QUERO ACESSAR O MÉTODO COMPLETO\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n☰ FUNDO DE FUNIL\n\""+p.hook3+"\"\nPixel + CAPI | Highest Volume | Freq máx: 4-5\nCTA: ▸ QUERO ACESSAR AGORA";
  }
  if (pasta===4) {
    return "△ 3 ENGRENAGENS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✦ Motor Pesado\n  produto/ + assets/\n✦ Estrutura do Produto\n  paginas/ (venda, obrigado, captura)\n  bonus/ (4 bônus)\n✦ Vitrine\n  anuncios/ + vercel.json\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▦ Mix 2026: 60-70% Reels + 20-30% Carrosséis\n◎ "+ideia+"\n◇ "+tom;
  }
  if (pasta===5) {
    return "△ 4 BÔNUS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n▸ Copy Viral — 30 modelos de legenda\n▸ Checklist — 5 dias do nicho ao lucro\n▸ Grupo VIP — Suporte + networking\n▸ Atualização Vitalícia — Sempre atualizado";
  }
  return "";
}

function launchConfetti() {
  const c=document.getElementById("confetti");
  const cl=["#ff6b35","#a855f7","#00e676","#ffd700","#22d3ee","#667eea","#fff"];
  for (let i=0;i<80;i++) {
    const p=document.createElement("div"); p.className="cf";
    p.style.left=Math.random()*100+"%";
    p.style.background=cl[Math.floor(Math.random()*cl.length)];
    p.style.width=Math.random()*6+4+"px"; p.style.height=Math.random()*6+4+"px";
    p.style.borderRadius=Math.random()>.5?"50%":"2px";
    p.style.animationDelay=Math.random()*2+"s"; p.style.animationDuration=Math.random()*2+2+"s";
    c.appendChild(p);
  }
  setTimeout(()=>c.innerHTML="",5000);
}

function toast(m,d=3000) {
  const e=document.getElementById("toast");
  e.textContent=m; e.classList.add("show");
  clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove("show"),d);
}

function copiarPasta(id) {
  const el=document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(()=>toast("▦ Copiado!"));
}

// Iniciar
updateProgress();
if (S.etapa===1) document.getElementById("ideiaInput").value=S.ideia;
if (S.etapa>=2) document.getElementById("criacaoInput").value=S.criacao;
if (S.etapa>1 && S.etapa<4) goEtapa(S.etapa);
if (S.ativado) { goEtapa(4); renderResultado(); document.getElementById("tbStep").textContent="✓ Ativado"; }
