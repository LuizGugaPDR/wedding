/**
 * Fonte única de conteúdo do Wedding OS.
 * Nenhum texto de domínio deve nascer no HTML — tudo vive aqui.
 * Todo o conteúdo é ficcional e humorístico. Ver docs/PRODUCT.md.
 */

export const wedding = Object.freeze({
  id: '13.03',
  groom: 'Luiz',
  bride: 'Mel Pitica',
  venue: 'Aflora Secreta',
  guestCount: 150,
  /** Datas em ISO com fuso de Brasília para o countdown não escorregar um dia. */
  projectStart: '2026-09-02T20:00:00-03:00',
  date: '2027-03-13T16:00:00-03:00',
  deadline: '2027-02-13T23:59:59-03:00',
  tagline: ['Um casamento.', '150 convidados.', 'Decisões questionáveis.'],
});

/** `key` é a chave usada no estado de votos. `short` existe para controles estreitos. */
export const people = Object.freeze([
  {
    key: 'luiz',
    name: 'Luiz',
    short: 'Luiz',
    title: 'COO',
    charter: 'Head of Questionable Decisions',
    duties: ['Fornecedores', 'Atrações', 'Ideias de risco elevado'],
  },
  {
    key: 'mel',
    name: 'Mel Pitica',
    short: 'Mel',
    title: 'CEO',
    charter: 'Poder de veto ilimitado',
    duties: ['Palavra final', 'Auditoria da lista', 'Controle de danos'],
  },
]);

/** Estados possíveis de um voto individual. */
export const VOTE = Object.freeze({
  APPROVED: 'approved',
  VETOED: 'vetoed',
  UNKNOWN: 'unknown',
});

export const decisionCategories = Object.freeze({
  cerimonia: 'Cerimônia',
  estrutura: 'Estrutura',
  bar: 'Bar',
  atracoes: 'Atrações',
  risco: 'Alto risco',
  comercial: 'Comercial',
});

/**
 * `weight` = impacto da divergência no cálculo de compatibilidade (1 trivial → 3 crítico).
 * `seed` = estado inicial de fábrica; é para onde o RESET WEDDING OS volta.
 */
export const decisions = Object.freeze([
  {
    id: 'data-13-03',
    title: 'A data: 13.03',
    category: 'cerimonia',
    weight: 3,
    note: 'Inegociável. Já virou identidade visual.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.APPROVED },
  },
  {
    id: 'local-aflora',
    title: 'Aflora Secreta como local',
    category: 'cerimonia',
    weight: 3,
    note: 'Aprovado antes mesmo de existir orçamento.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.APPROVED },
  },
  {
    id: 'convidados-150',
    title: '150 convidados',
    category: 'estrutura',
    weight: 2,
    note: 'Número fechado. A lista de espera é maior que a lista.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.APPROVED },
  },
  {
    id: 'espaco-kids',
    title: 'Espaço kids no andar de baixo, com monitoras',
    category: 'estrutura',
    weight: 2,
    note: 'A única decisão genuinamente responsável do documento.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.APPROVED },
  },
  {
    id: 'gelo-de-coco',
    title: 'Gelo de coco em tudo',
    category: 'bar',
    weight: 1,
    note: 'Consenso imediato. Nenhuma discussão registrada.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.APPROVED },
  },
  {
    id: 'bali-quente',
    title: 'Combo Bali Quente — whisky com energético',
    category: 'bar',
    weight: 2,
    note: 'O nome foi decidido antes da receita.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.APPROVED },
  },
  {
    id: 'acompanhantes',
    title: 'Acompanhantes contratadas',
    category: 'risco',
    weight: 2,
    note: 'Primeiro veto formal da noiva. Consta em ata.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.VETOED },
  },
  {
    id: 'galo-tirolesa',
    title: 'Galo Doido descendo de tirolesa',
    category: 'atracoes',
    weight: 3,
    note: 'Entrada triunfal do mascote. Sem plano B.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'anoes-tequileiros',
    title: '2 anões tequileiros',
    category: 'bar',
    weight: 3,
    note: 'Dois. Não um, não três.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'pole-dance',
    title: 'Barra de pole dance',
    category: 'risco',
    weight: 3,
    note: 'Item 01 da lista original. Abriu o precedente para todo o resto.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'dark-room',
    title: 'Dark room',
    category: 'risco',
    weight: 3,
    note: 'Sinalização discreta. Localização propositalmente não divulgada.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'caipirinha-ccc',
    title: 'Caipirinha catapora caipora curupira',
    category: 'bar',
    weight: 2,
    note: 'Ninguém lembra o que tem dentro.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'copao-whisky',
    title: 'Copão de whisky e gin no bar principal',
    category: 'bar',
    weight: 1,
    note: 'Copão. A palavra usada foi exatamente essa.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'savel-aliancas',
    title: 'Savel entrando com as alianças',
    category: 'cerimonia',
    weight: 2,
    note: 'Cargo de altíssima confiança entregue sem entrevista.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'after-mrv',
    title: 'After na Arena MRV',
    category: 'risco',
    weight: 3,
    note: 'Nenhum contato foi feito com o estádio. Nenhum.',
    seed: { luiz: VOTE.APPROVED, mel: VOTE.UNKNOWN },
  },
  {
    id: 'alvim-esquilos',
    title: 'Alvim e os Esquilos, com esquiletes',
    category: 'atracoes',
    weight: 2,
    note: 'As esquiletes são inegociáveis segundo a lista original.',
    seed: { luiz: VOTE.UNKNOWN, mel: VOTE.UNKNOWN },
  },
  {
    id: 'padre-marcelo',
    title: 'Celebração por Padre Marcelo Rossi',
    category: 'cerimonia',
    weight: 2,
    note: 'Convite não enviado. Expectativa mantida assim mesmo.',
    seed: { luiz: VOTE.UNKNOWN, mel: VOTE.UNKNOWN },
  },
  {
    id: 'patrocinio-h2bet',
    title: 'Patrocínio master da H2bet',
    category: 'comercial',
    weight: 2,
    note: 'Proposta comercial ainda não redigida. Nem iniciada.',
    seed: { luiz: VOTE.UNKNOWN, mel: VOTE.UNKNOWN },
  },
  {
    id: 'item-redigido',
    title: '[REDIGIDO PELO DEPARTAMENTO JURÍDICO]',
    category: 'risco',
    weight: 1,
    note: 'Item 07 da lista original. O jurídico foi enfático.',
    seed: { luiz: VOTE.UNKNOWN, mel: VOTE.UNKNOWN },
  },
]);

/** Prioridade de uma nova ideia vira o peso dela no cálculo de compatibilidade. */
export const priorities = Object.freeze([
  { id: 'baixa', label: 'Baixa', weight: 1 },
  { id: 'media', label: 'Média', weight: 2 },
  { id: 'alta', label: 'Alta', weight: 3 },
]);

/** Faixas de compatibilidade, da mais alta para a mais baixa. */
export const compatibilityBands = Object.freeze([
  { min: 90, label: 'Compatibilidade operacional excelente' },
  { min: 75, label: 'Pequenas divergências contratuais' },
  { min: 55, label: 'Conselho matrimonial solicitado' },
  { min: 0, label: 'Risco de renegociação detectado' },
]);

export const milestones = Object.freeze([
  { id: 'inicio', date: wedding.projectStart, label: 'Início' },
  { id: 'deadline', date: wedding.deadline, label: 'Fim das pendências' },
  { id: 'cerimonia', date: wedding.date, label: 'Cerimônia' },
]);

/**
 * Os oito destinos da experiência. `route` nulo = ainda não construído;
 * a lista mostra como trancado em vez de esconder o que vem por aí.
 */
export const universe = Object.freeze([
  {
    id: 'control-center',
    index: '01',
    label: 'Centro de Controle',
    note: 'Prontidão operacional, riscos e o que ninguém decidiu ainda.',
    route: 'control-center',
  },
  {
    id: 'guest-intelligence',
    index: '02',
    label: 'Atrações principais',
    note: 'Cinco nomes no topo do cartaz. Nenhum contrato foi assinado.',
    route: 'guests',
  },
  {
    id: 'festival',
    index: '03',
    label: 'Festival 13.03',
    note: 'Pôster digital. IG × KayBlack no topo do cartaz.',
    route: null,
  },
  {
    id: 'experience-map',
    index: '04',
    label: 'Mapa da Experiência',
    note: 'Onze áreas. Uma delas não aparece no mapa impresso.',
    route: null,
  },
  {
    id: 'escape-plan',
    index: '05',
    label: 'Plano de Fuga',
    note: 'Rosa, Caribe, Grécia. Retorno opcional.',
    route: null,
  },
  {
    id: 'after-protocol',
    index: '06',
    label: 'Protocolo do After',
    note: 'Destino absolutamente questionável.',
    route: null,
  },
  {
    id: 'classified',
    index: '07',
    label: 'Confidencial',
    note: 'Requer autorização de segurança.',
    route: null,
  },
  {
    id: 'contract',
    index: '08',
    label: 'Contrato 13.03',
    note: 'Assinatura pendente de uma das partes.',
    route: null,
  },
]);

/**
 * Acesso privado. É encanto, não segurança: o repositório é público e a frase está
 * aqui à vista. A graça é a pergunta, não o segredo.
 */
export const access = Object.freeze({
  phrase: 'já posso?',
  vow: 'Dois anões tequileiros garantem que você sabe a resposta.',

  /**
   * Palavras da lista original atravessando a tela. `offset` (0–1) é o ponto do
   * percurso em que cada uma já está no carregamento — sem isso a tela começaria
   * vazia. `shift` negativo inverte o sentido da travessia.
   * Durações propositalmente sem divisor comum: se casarem, as treze passam a
   * cruzar a tela em bloco.
   */
  drift: Object.freeze([
    { text: 'Galo Doido', top: 12, size: 2.3, shift: 3.8, duration: 53, offset: 0.10 },
    { text: 'Dark room', top: 19, size: 2.1, shift: -3.5, duration: 64, offset: 0.62 },
    { text: 'Gelo de coco', top: 26, size: 1.7, shift: -2.9, duration: 43, offset: 0.33 },
    { text: 'Tirolesa', top: 33, size: 1.8, shift: 3, duration: 59, offset: 0.78 },
    { text: 'Rinha de anão vs drag queen', top: 40, size: 1.5, shift: 3.2, duration: 71, offset: 0.21 },
    { text: 'Alvin e os Esquilos', top: 47, size: 1.55, shift: -3.4, duration: 49, offset: 0.55 },
    { text: 'Bali Quente', top: 54, size: 1.9, shift: -3.7, duration: 56, offset: 0.88 },
    { text: 'Copão de whisky e gin', top: 61, size: 1.5, shift: 3.5, duration: 67, offset: 0.42 },
    { text: 'Anão tequileiro (duas unidades)', top: 68, size: 1.4, shift: 2.7, duration: 46, offset: 0.15 },
    { text: 'Savel com as alianças', top: 75, size: 1.5, shift: -3.2, duration: 61, offset: 0.70 },
    { text: 'Espaço kids com monitoras', top: 82, size: 1.55, shift: -3, duration: 73, offset: 0.28 },
    { text: '@mariah_luizaa0 nossa diva cuida do pet', top: 89, size: 1.25, shift: 2.6, duration: 68, offset: 0.49 },
    { text: 'Caipirinha catapora caipora curupira', top: 96, size: 1.35, shift: 3.6, duration: 52, offset: 0.83 },
  ]),

  /** Dossiê da verificação. Sério demais para uma senha romântica — é essa a piada. */
  dossier: Object.freeze([
    { label: 'Registro', value: 'Primeiro contato · arquivado' },
    { label: 'Tentativas', value: 'Ilimitadas, mas anotadas' },
    { label: 'Dica', value: 'Duas palavras. Termina em interrogação.' },
  ]),

  denied: Object.freeze({
    verdict: 'Access denied',
    reason: 'Essa não foi a primeira coisa que foi perguntado para você.',
    retry: 'Try again.',
  }),
  sequence: Object.freeze([
    { text: 'Validating...', hold: 420 },
    { text: 'Match found.', hold: 420 },
    { text: 'First contact verified.', hold: 520 },
  ]),
  granted: Object.freeze({
    verdict: 'Access granted',
    reason: 'Bem-vinda ao nosso caos.',
    hold: 520,
  }),

  /**
   * Revelação depois do desbloqueio. Se a imagem não carregar, a etapa é pulada
   * inteira — nunca aparece moldura vazia.
   */
  reveal: Object.freeze({
    image: './assets/images/casal.jpg',
    alt: 'Luiz e Mel Pitica',
    eyebrow: 'Evidência 001',
    title: 'Eu tenho elogios melhores pra você, mas seu ego ainda não está preparado',
    fade: 1500,
    // Sete segundos parados: é tempo de ler sem pressa, não de relance.
    hold: 7000,
  }),
});

/** Leituras fixas do Control Center. As derivadas são compostas em dashboard.js. */
export const operations = Object.freeze([
  { id: 'legal-risk', label: 'Risco jurídico', value: 'Extremo', tone: 'accent' },
  { id: 'budget', label: 'Situação do orçamento', value: 'Não pergunte', tone: 'plain' },
  { id: 'galo', label: 'Operação Galo', value: 'Aguardando liberação', tone: 'discovery' },
]);

/** Risco de fuga da noiva, derivado da compatibilidade. Da mais alta para a mais baixa. */
export const escapeRiskBands = Object.freeze([
  { min: 85, label: 'Baixo' },
  { min: 70, label: 'Moderado' },
  { min: 50, label: 'Elevado' },
  { min: 0, label: 'Crítico' },
]);

export const guestStatus = Object.freeze({
  confirmado: 'Confirmado',
  'convite-nao-enviado': 'Convite não enviado',
  'convite-enviado': 'Convite enviado',
  'aguardando-resposta': 'Aguardando resposta',
  'presenca-improvavel': 'Presença improvável',
  'negociacao-avancada': 'Negociação avançada',
  'confirmado-delirio': 'Confirmado pelo departamento de delírio',
});

/** Camada única: o cartaz só tem topo. */
export const guestTiers = Object.freeze([
  {
    id: 'inner',
    index: '01',
    label: 'Atrações principais',
    note: 'Os nomes que abrem o cartaz. Metade atende o telefone; a outra metade nem sabe que ele existe.',
  },
]);

/**
 * Cinco nomes, uma camada. Ninguém aqui foi convidado de verdade: quem é pessoa
 * pública fica com `confirmado-delirio` de propósito, porque o repositório é
 * público e nada pode soar como afirmação factual sobre gente real.
 */
export const guests = Object.freeze([
  { id: 'japa-nk', name: 'Japa NK', tier: 'inner', role: 'Convidado de honra', status: 'confirmado' },
  { id: 'snoop-dogg', name: 'Snoop Dogg', tier: 'inner', role: 'Convidado internacional', status: 'confirmado-delirio' },
  { id: 'mariah', name: '@mariah__luizaa0', tier: 'inner', role: 'Cuida do pet no dia', status: 'confirmado' },
  { id: 'mc-gw', name: 'MC GW', tier: 'inner', role: 'Atração do after', status: 'confirmado-delirio' },
  { id: 'mc-ig', name: 'MC IG', tier: 'inner', role: 'Topo do cartaz', status: 'confirmado-delirio' },
]);

/**
 * Show da noite. Cartaz de luta, evidentemente fictício: não existe data, local
 * nem contrato, e nada aqui descreve fato real sobre ninguém.
 */
export const showdown = Object.freeze({
  eyebrow: 'Main event · 13.03',
  challenger: 'As irmãs do Luiz',
  versus: 'versus',
  opponent: 'Kaio Jorge',
  cue: 'Ver a evidência',
  note: 'Sem data, sem local, sem contrato. Como todo o resto.',
  image: './assets/images/main-event.png',
  alt: 'Registro do adversário anunciado para o main event.',
});

/** Line-up ficcional. Nenhuma apresentação foi contratada, negociada ou sequer mencionada aos artistas. */
export const attractions = Object.freeze([
  { id: 'ig', name: 'IG', stage: 'main', slot: '23:40', headliner: true, status: 'negociacao-avancada' },
  { id: 'kayblack', name: 'KayBlack', stage: 'main', slot: '23:40', headliner: true, status: 'negociacao-avancada' },
  { id: 'hariel', name: 'Hariel', stage: 'main', slot: '01:10', status: 'aguardando-resposta' },
  { id: 'anitta-set', name: 'Anitta', stage: 'main', slot: '02:30', status: 'presenca-improvavel' },
  { id: 'tuto', name: 'Tuto', stage: 'sunset', slot: '19:20', status: 'convite-enviado' },
  { id: 'kako', name: 'Kako', stage: 'sunset', slot: '20:00', status: 'convite-enviado' },
  { id: 'isis', name: 'Isis', stage: 'sunset', slot: '20:40', status: 'convite-enviado' },
  { id: 'ryan-sp-set', name: 'Ryan SP', stage: 'sunset', slot: '21:30', status: 'aguardando-resposta' },
  { id: 'mc-gw', name: 'MC GW', stage: 'after', slot: '04:00', status: 'confirmado-delirio' },
  { id: 'gordao-do-pc', name: 'Gordão do PC', stage: 'after', slot: '04:40', status: 'confirmado-delirio' },
  { id: 'wesley-alemao-set', name: 'Wesley Alemão', stage: 'after', slot: '05:20', status: 'aguardando-resposta' },
]);

export const stages = Object.freeze({
  main: { label: 'Palco Principal', description: 'O palco principal, virado para o pôr do sol.' },
  sunset: { label: 'Palco do Pôr do Sol', description: 'Aquecimento durante o coquetel.' },
  after: { label: 'Palco do After', description: 'Fora do Aflora. Fora de controle.' },
});

export const experiences = Object.freeze([
  { id: 'pole-stage', name: 'Barra de pole dance', area: 'pole-stage', tier: 'signature', description: 'Estrutura central com iluminação dedicada. Programação divulgada no dia.' },
  { id: 'alvim', name: 'Alvim e os Esquilos', area: 'main-stage', tier: 'signature', description: 'Formação completa, esquiletes incluídas.' },
  { id: 'galo-doido', name: 'Galo Doido de tirolesa', area: 'ceremony', tier: 'signature', description: 'Descida única, sem ensaio, sem seguro.' },
  { id: 'anoes', name: '2 anões tequileiros', area: 'cocktail-bar', tier: 'signature', description: 'Serviço itinerante de tequila durante toda a recepção.' },
  { id: 'caipirinha', name: 'Caipirinha catapora caipora curupira', area: 'cocktail-bar', tier: 'bar', description: 'Receita perdida. Efeito documentado.' },
  { id: 'bali-quente-exp', name: 'Bali Quente', area: 'cocktail-bar', tier: 'bar', description: 'Whisky com energético. Servido morno por decisão editorial.' },
  { id: 'copao', name: 'Copão de whisky', area: 'cocktail-bar', tier: 'bar', description: 'Dose única, recipiente questionável.' },
  { id: 'gin', name: 'Gin', area: 'cocktail-bar', tier: 'bar', description: 'Presente na lista sem qualquer detalhamento adicional.' },
  { id: 'gelo-coco-exp', name: 'Gelo de coco', area: 'cocktail-bar', tier: 'bar', description: 'Aplicado indiscriminadamente em todos os drinks.' },
  { id: 'dark-room-exp', name: 'Dark room', area: 'dark-room', tier: 'restrito', description: 'Acesso restrito. Nenhuma outra informação será prestada.' },
  { id: 'kids', name: 'Espaço kids', area: 'kids-zone', tier: 'estrutura', description: 'Andar de baixo, com monitoras e horário de encerramento real.' },
  { id: 'after-exp', name: 'After Protocol', area: 'after-route', tier: 'signature', description: 'Deslocamento coordenado ao destino final.' },
]);

/** Coordenadas em % dentro do viewBox do mapa (Sprint 5). */
export const mapAreas = Object.freeze([
  { id: 'ceremony', label: 'Cerimônia', x: 22, y: 24, description: 'Onde tudo começa e o Galo aterrissa.' },
  { id: 'main-stage', label: 'Palco Principal', x: 62, y: 18, description: 'Estrutura principal do line-up.' },
  { id: 'cocktail-bar', label: 'Bar de Coquetéis', x: 44, y: 46, description: 'Operação de bebidas e tequila itinerante.' },
  { id: 'pole-stage', label: 'Palco do Pole', x: 74, y: 44, description: 'Palco satélite com iluminação própria.' },
  { id: 'vip', label: 'Mesa VIP', x: 84, y: 66, description: 'Mesa 01 e adjacências.' },
  { id: 'kids-zone', label: 'Espaço Kids', x: 16, y: 62, description: 'Andar de baixo, monitorado.' },
  { id: 'dark-room', label: 'Sala Escura', x: 33, y: 76, description: 'Não sinalizado no mapa impresso.' },
  { id: 'groom-ops', label: 'Central do Noivo', x: 56, y: 70, description: 'Centro de comando do noivo.' },
  { id: 'after-route', label: 'Rota do After', x: 70, y: 88, description: 'Saída coordenada rumo ao after.' },
]);

export const honeymoon = Object.freeze({
  label: 'Pré-lua de mel',
  legs: [
    { id: 'rosa', name: 'Rosa', country: 'Brasil', note: 'Primeira parada. Silêncio obrigatório.' },
    { id: 'caribe', name: 'Caribe', country: 'Rota indefinida', note: 'Nenhuma ilha específica foi escolhida.' },
    { id: 'grecia', name: 'Grécia', country: 'Europa', note: 'Destino final. Retorno opcional.' },
  ],
});

export const sponsors = Object.freeze([
  { id: 'h2bet', name: 'H2bet', tier: 'master', status: 'Negociação pendente' },
]);

export const timeline = Object.freeze([
  { version: '0.1.0', date: '2026-09-02', title: 'Projeto iniciado', note: 'Lista criada durante um date.' },
  { version: '0.2.0', date: '2026-09-03', title: 'Wedding OS no ar', note: 'A brincadeira virou software.' },
  { version: '1.0.0-rc', date: '2027-02-13', title: 'Congelamento do escopo', note: 'Fim do prazo para pendências.' },
  { version: '1.0.0', date: '2027-03-13', title: 'Entrada em produção', note: 'Aflora Secreta.' },
]);

/** `hint` nunca é exibido antes da descoberta. Serve de documentação interna. */
export const easterEggs = Object.freeze([
  { id: 'galo', label: 'Protocolo Galo', hint: 'Tirolesa acionada a partir do mascote.' },
  { id: 'snoop', label: 'Modo Snoop', hint: 'Escondido no card do convidado internacional.' },
  { id: 'classified', label: 'Confidencial', hint: 'Autorização de segurança com a data.' },
  { id: 'after', label: 'Protocolo do After', hint: 'Disparado ao entrar na rota do after.' },
  { id: 'treze-zero-tres', label: '13.03', hint: 'Interação repetida sobre a identidade no topo.' },
  { id: 'casal', label: 'Aquele date', hint: 'Guardado para o final emocional.' },
  { id: 'operacao', label: 'Operação 13.03', hint: 'As oito evidências do caça-palavras.' },
]);

/**
 * Operação 13.03 — caça-palavras.
 *
 * As posições são fixas de propósito: o grid precisa ser o mesmo em toda visita, e
 * a seleção do usuário é validada contra estas coordenadas, não contra as letras.
 * `dr`/`dc` são o passo por letra, então palavra com passo negativo aparece
 * invertida na tela. `word` já vem sem acento — o acento vive só em `display`.
 */
export const evidenceBoard = Object.freeze({ size: 20, seed: 1303 });

export const evidence = Object.freeze([
  {
    id: 'galo',
    display: 'GALO',
    word: 'GALO',
    row: 2,
    col: 3,
    dr: 0,
    dc: 1,
    message: 'AIRSPACE IDENTIFIED',
  },
  {
    id: 'anao',
    display: 'ANÃO',
    word: 'ANAO',
    row: 10,
    col: 3,
    dr: -1,
    dc: 0,
    message: 'SMALL ASSET. HIGH PRIORITY.',
  },
  {
    id: 'darkroom',
    display: 'DARKROOM',
    word: 'DARKROOM',
    row: 5,
    col: 11,
    dr: 0,
    dc: -1,
    message: 'RESTRICTED AREA LOCATED',
  },
  {
    id: 'tequileiro',
    display: 'TEQUILEIRO',
    word: 'TEQUILEIRO',
    row: 4,
    col: 16,
    dr: 1,
    dc: 0,
    message: 'OPERATIONAL ASSET LOCATED',
  },
  {
    id: 'alvin',
    display: 'ALVIN',
    word: 'ALVIN',
    row: 12,
    col: 6,
    dr: 1,
    dc: 1,
    message: 'CHIPMUNK PROTOCOL IDENTIFIED',
  },
  {
    id: 'curupira',
    display: 'CURUPIRA',
    word: 'CURUPIRA',
    row: 17,
    col: 5,
    dr: 0,
    dc: 1,
    message: 'COCKTAIL INTELLIGENCE RECOVERED',
  },
  {
    id: 'acompanhante',
    display: 'ACOMPANHANTE',
    word: 'ACOMPANHANTE',
    row: 3,
    col: 2,
    dr: 1,
    dc: 0,
    message: 'VIP SUPPORT IDENTIFIED',
  },
  // A mais difícil: 20 letras na diagonal, de baixo para cima, cruzando o grid inteiro.
  {
    id: 'ficantenamonoivorido',
    display: 'FICANTENAMONOIVORIDO',
    word: 'FICANTENAMONOIVORIDO',
    row: 19,
    col: 0,
    dr: -1,
    dc: 1,
    message: 'RELATIONSHIP STATUS IDENTIFIED',
    saga: ['FICANTE → NAMO → NOIVO → MARIDO', 'EVOLUTION PROTOCOL: ACTIVE'],
  },
]);
