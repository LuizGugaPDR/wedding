# Changelog

Todas as mudanças relevantes do Wedding OS. Uma entrada por sprint.

## [0.7.0] — 2026-09-04 · Sprint 3.6 · Experience Foundation

### Changed
- **Identidade ICE WEDDING.** Gelo `#EEF0EA` na base, grafite de subtom esverdeado `#202822`
  no texto, coral `#FF5548` como energia, oliva `#68745B` como estado estável e manteiga
  apenas em detalhe. Saíram o creme amarelado e o azul de tela cheia.
- **Coral virou preenchimento, nunca texto.** Sobre gelo ele mede 2,8:1; todo coral escrito
  passou para `#B3382A` (5,2:1). Oliva de texto ficou `#4D5844` porque a versão clara
  reprovava (4,2:1) sobre o próprio tint de 14%.
- **Navegação por rolagem virou navegação por views.** A Home é o hub; Control Center e
  Decision Engine são destinos com rota própria. `scroll.js` perdeu o motor de cenas e ficou
  só com o reveal — nada de palco `sticky`, trilho de capítulos ou `--scene-progress`.
- **Control Center reconstruído** como página editorial de dados: readiness em escala grande,
  dez leituras em fio, e as duas métricas de decisão abrem o Decision Engine.
- Cronograma passou a viver dentro do Control Center; Conselho, dentro do Decision Engine.
- Hero deixou de ocupar a tela inteira: ela é abertura e entrega ao índice de destinos.

### Added
- **Lock screen.** `PRIVATE ACCESS`, cadeado em SVG e a frase para duas pessoas apenas.
  O clique abre `ACESSO RESTRITO`, com indicadores operacionais e pulsação discreta.
- Senha do primeiro contato: espaços nas pontas e caixa são ignorados, acento e pontuação não.
  Erro responde `ACCESS DENIED` com feedback integrado; acerto executa a sequência de
  validação, abre a haste do cadeado e libera com `ACCESS GRANTED`.
- `js/router.js`: views por hash com uma única linguagem de transição (200 ms saindo,
  380 ms entrando), foco movido para a view e retorno pelo botão do navegador.
- `js/lock.js`: acesso em `<dialog>` nativo, com foco preso e Esc recuando da verificação.
- `BLOQUEAR WEDDING OS` no rodapé, para ensaiar a entrada antes de entregar o notebook.
- Breadcrumb `13.03 / CONTROL CENTER` e `← UNIVERSE` no chrome persistente.
- Treze palavras da lista original derivando ao fundo da tela trancada, em Inter 500 — Bodoni
  itálico fechava as letras em corpo pequeno e as frases longas viravam borrão. Vaivém de 8 a
  12s, decorativas e fora da árvore de acessibilidade. Uma máscara radial apaga o que chega
  perto do painel: nada disputa leitura com a pergunta. Passar o mouse acende a palavra em
  coral e liga um segundo impulso mais rápido.
- Rastro de corações atrás do ponteiro, só dentro do cadeado. Um a cada 52px percorridos,
  teto de dez simultâneos, 900ms de vida. Exceção registrada à regra de "sem corações".
- Revelação do desbloqueio: depois de `ACCESS GRANTED`, a foto do casal sobe em 1,5s com
  `Evidência 001` e some de uma vez junto com o cadeado. Sem a imagem em disco a etapa é
  pulada inteira — nunca aparece moldura vazia.
- Dossiê da verificação: registro, tentativas e a dica de que a senha termina em interrogação.

### Fixed
- Destinos ainda não construídos respondem ao clique com uma mensagem operacional em vez de
  ficarem inertes.
- Overflow horizontal em 320px: o status do destino descia mal no índice e a trilha interna
  de cada leitura crescia por conteúdo, vazando a coluna.
- CTA da Home caía fora da dobra em 320×640 e 1366×660.

### Removed
- `[data-theme]`, `.scene`, `.chapter-rail`, `startScrollEngine()`, `--scene-progress`,
  `--scene-travel`, `--narrative-progress`, `--space-4xl` e o export morto `figures`.

## [0.6.0] — 2026-09-04 · Sprint 3.5 · Summer Experience Rework

### Changed
- **Nova identidade: Mediterranean Wedding Party.** O fundo escuro deu lugar a creme `#F5F0E8`,
  o champagne a coral `#FF4D3D` e entrou azul mediterrâneo `#2457F5` como cor de operação.
  Texto em grafite quente `#2A1F1A`, nunca preto absoluto.
- Cores passaram a ter função: coral é ação e conflito, azul é acordo e operação, amarelo é
  descoberta. `Aprovação unânime` virou azul; `negociação` e `veto`, coral.
- Escala tipográfica ampliada: display de 8rem para 11rem, mais `--display-hero` de até 20rem.
- Hero reconstruída do zero: composição assimétrica, nomes em escala editorial, `13.03` como
  contorno coral sangrando no canto, selo circular e countdown na coluna direita.
- CTA virou `Entrar no nosso caos →`, com seta que avança e atração magnética.
- Dashboard virou **Control Center**, em azul de tela, com dez leituras operacionais.

### Added
- `[data-theme]`: cada capítulo pode ter personalidade própria sem sair da paleta.
- `js/interactions.js`: ponteiro normalizado em `--pointer-x/y` e atração magnética, ambos
  desligados sem hover fino ou com movimento reduzido.
- **The 13.03 Universe**: índice tipográfico dos oito destinos. Os não construídos aparecem
  trancados com selo amarelo em vez de escondidos.
- `universe`, `operations` e `escapeRiskBands` em `data.js`; sexto Easter Egg (`Classified`).

### Fixed
- Sete reprovações de contraste introduzidas pela paleta clara: terciário sobre creme subiu
  para `#7A6459` (4.9:1) e o tema azul passou a usar `#1E48CC` de tela, onde o creme mede
  6.5:1 e cabe a hierarquia de texto.
- O CTA da Hero ficava fora do palco fixo em 320×640 e 375×667.

## [0.5.1] — 2026-09-04 · Sprint 3.1 · Correções da auditoria

### Fixed
- **`.lede` estava sem estilo.** A regra foi removida na Sprint 1.1 por não ter consumidor e
  a classe voltou a ser usada na Sprint 3, em Conselho e Decisões. Os dois parágrafos de apoio
  apareciam em cor de texto principal e sem limite de medida.
- Título com apenas espaços criava uma decisão sem título: o `required` aceita espaços e o
  `trim` acontecia depois. Agora `pattern` barra na origem, com mensagem própria em português.

### Removed
- Token inventado `--text-sm-ui`, que só funcionava pelo fallback.
- Classes sem regra alguma: `bar__label`, `decisions`, `entry__name`.

### Added
- Regra própria para `.gauge`, o bloco que carrega `--meter-value` e é alvo de `closest()`.
- Varredura de CSS nos **dois sentidos** entrou no quality gate: nenhum seletor sem elemento
  e nenhuma classe sem regra. A varredura anterior só cobria um sentido e por isso não
  pegou a regressão do `.lede`.

## [0.5.0] — 2026-09-03 · Sprint 3 · Decision Engine

### Added
- `js/decisions.js` com os capítulos `03 · Conselho` e `04 · Decisões`.
- As 19 decisões agrupadas por categoria, com voto duplo e status derivado. Cada clique
  recalcula progresso, compatibilidade e o capítulo 01 na mesma ação.
- `+ NOVA IDEIA` em `<dialog>` nativo: título, categoria, prioridade, proponente e comentário.
- `state.allDecisions()`: o catálogo fixo e as ideias do casal no mesmo formato. Uma ideia nova
  entra no grupo escolhido, conta no progresso e nasce **Em análise** com o voto de quem propôs.
- Wedding Executive Board — CEO com veto ilimitado, COO de decisões questionáveis, com alçadas.
- Pulso curto no fio da linha quando o veredito muda, e só quando muda.

### Changed
- `mergePersisted` passou a preservar os votos das ideias criadas; antes só aceitava ids do
  catálogo e uma ideia perdia os votos no reload.
- Os números vivos do dashboard saíram de `data.js` para `dashboard.js`, onde há estado:
  `decisões catalogadas` agora acompanha as ideias adicionadas.

### Fixed
- O `<dialog>` abria colado no topo: o `* { margin: 0 }` do reset derrubava o `margin: auto`
  que centraliza modais nativos.
- `Esc` passou a ser tratado explicitamente e o foco volta ao botão de origem ao fechar.

## [0.4.2] — 2026-09-03 · Legibilidade e ritmo

### Changed
- **Paleta mais clara.** Fundo de `#0A0A0B` para `#121215` e os três níveis de texto subiram
  junto. Contrastes: texto 16.6:1, accent 9.4:1, secundário 7.2:1, terciário 5.3:1 —
  todos acima do piso, com folga maior do que antes.
- Accent de `#C8A96A` para `#D2B478` e veto de `#A8635C` para `#B8706A`, acompanhando o fundo.
- Bordas de 8%/18% para 13%/26%: os fios editoriais somem menos.
- A entrada permanece inteira nos primeiros 40% da travessia e só depois recua. Antes,
  100px de rolagem já deixavam a contagem regressiva em 58% de opacidade e 300px a apagavam.
- Curso da entrada de 145vh para 190vh; cenas de 260vh para 180vh, onde só havia rolagem morta.
- Fundo do chrome virou token `--color-chrome-bg` — era o único valor de cor solto no CSS.

### Fixed
- **O CTA da entrada era inalcançável em janela de notebook.** Em 1366×660 o botão ficava em
  654–698px, fora de um palco `sticky` de 604px: nenhuma rolagem chegava nele. Novo breakpoint
  por altura (`max-height: 46em`) reduz tipografia e espaçamento. Verificado de 1280×600 a
  1920×1080 e de 320×640 a 768×1024.

## [0.4.1] — 2026-09-03 · Sprint 2.1 · Correções da auditoria

### Added
- `h2` real no capítulo 01, derivado do estado: `12 itens ainda esperam veredito.`
  Antes o capítulo mais importante não tinha cabeçalho — alvo do CTA, com `tabindex`,
  e nada para anunciar.
- `data-reveal-once`: reveal que não desfaz. Barras de dado zerando na volta pareciam
  falha de renderização, não narrativa.
- Marcos do cronograma em `<time datetime>`, com a data montada por `formatToParts` —
  `toISOString` empurraria o deadline das 23:59 para o dia seguinte.
- Composição própria do dashboard abaixo de 768: tipografia e espaçamento reduzidos para
  o palco fixo caber inteiro.

### Changed
- `mountOverview` virou `mountFigures` — o nome prometia o capítulo inteiro e montava uma lista.
- `updateOverview` só escreve no DOM quando o valor exibido muda: 34 escritas em 60 quadros
  de rolagem, contra 60 antes.

### Removed
- Regras órfãs no responsivo: `.overview` (Sprint 2), `.decision__head` e `.type-specimen__row`
  (sobras da Sprint 0 que a limpeza da 1.1 não alcançou).

### Fixed
- O `h2` novo empurrava o palco fixo para 724px numa viewport de 667px. Conteúdo abaixo da
  dobra de um elemento `sticky` é inalcançável — agora o palco cabe de 320×640 a 1440×900.

## [0.4.0] — 2026-09-03 · Sprint 2 · Wedding Dashboard

### Added
- `js/dashboard.js` com os capítulos `01 · Visão geral` e `02 · Cronograma`.
- Visão geral como cena: os medidores de organização e compatibilidade sobem de zero durante
  os primeiros 45% da travessia e travam no valor real de `state.js`.
- Faixas de compatibilidade em `data.js`, da aprovação operacional ao risco de renegociação.
- `figures`: lista editorial de números com fio. Os dois primeiros derivam de `wedding` e
  `decisions`; o resto é a piada — 02 anões tequileiros, 01 Galo Doido, `???`.
- Cronograma com duas barras: tempo decorrido em cinza contra organização em champagne.
  O contraste entre `00%` e `37%` é o argumento.
- `milestones` e `wedding.projectStart` em `data.js`; `.split` como composição assimétrica padrão.
- `onScene` de volta ao motor de rolagem, agora com consumidor real.

### Changed
- O trilho de capítulos ficou fino: o rótulo saiu do fluxo e só aparece no hover ou no foco.
  A partir de 1024 o conteúdo cede a faixa direita para ele.
- Com `prefers-reduced-motion`, o motor reporta cena concluída em vez de progresso zero —
  antes os medidores ficariam parados em `0%`.

### Fixed
- Valor e rótulo das linhas de números caíam em linhas diferentes: faltava fixar a linha da grade.
- O medidor da visão geral herdava a transição do chrome e ficava atrasado em relação à rolagem.

## [0.3.1] — 2026-09-03 · Sprint 1.1 · Correções da auditoria

### Added
- `assets/images/og.png` (1200×630) e `twitter:card` como `summary_large_image`: o preview do
  link em mensageiro agora mostra o convite, não um retângulo cinza.
- Aprimoramento progressivo em quatro camadas: texto da entrada presente no HTML,
  `[data-reveal]` escopado em `.js`, vigia de boot em 1,5s e `try/catch` no bootstrap.

### Changed
- `--color-text-faint` de `#56534E` para `#807B72`. O disclaimer de ficção e o deadline
  estavam em **2.58:1**, reprovando WCAG AA; agora medem **4.71:1**.
- CTA da entrada virou `<a href="#overview">`. Funciona sem JavaScript e o rolar suave já
  respeita `prefers-reduced-motion` — o JS só acrescenta a persistência da preferência.

### Removed
- CSS órfão deixado pela remoção da tela de diagnóstico: `.grid-editorial`, `.col-span-*`,
  `.stack*`, `.lift`, `.lede`, `.display--lg`, `.display--sm`.
- Tokens sem consumidor: `--color-surface`, `--color-surface-2`, `--radius-md`, `--text-sm`,
  `--dur-cinematic`, `--shadow-md`.
- Exports sem consumidor: `isPersistent`, `timeUntil`, `prefersReducedMotion` e as funções de
  limpeza que nunca eram chamadas.

### Fixed
- HTML inválido na Visão geral: `<dd>` vinha antes de `<dt>`. A ordem visual passou para o CSS,
  via `flex-direction: column-reverse`.

## [0.3.0] — 2026-09-03 · Sprint 1 · Cinematic Entry

### Added
- Entrada cinematográfica: `Luiz & Mel Pitica`, tagline, local, data e convidados,
  todos renderizados a partir de `data.js`.
- `js/countdown.js`: contagem regressiva ao vivo para 13/03/2027, com numerais tabulares,
  e cálculo dos dias restantes até o deadline de 13/02/2027.
- CTA `Entrar no planejamento`, que marca `prefs.entered` e conduz ao capítulo seguinte.
- Segunda visita reconhecida: a abertura não se repete e o CTA vira `Continuar planejamento`.
- Capítulo `01 · Visão geral` como destino da transição.
- `state.setPref()` para preferências locais persistidas.

### Changed
- Chrome do OS e trilho de capítulos ficam ocultos durante a entrada e entram junto com o
  capítulo 01 — o sistema não compete com o convite.
- `RESET WEDDING OS` migrou para o rodapé, onde fica sempre acessível.
- `history.scrollRestoration = 'manual'`: o navegador não restaura rolagem antiga sobre a entrada.

### Removed
- Tela de diagnóstico da Sprint 0 e todo o CSS que existia só para ela: boot log, swatches,
  espécime tipográfico, readout e painel.
- CSS de decisões, votos e status — volta na Sprint 3 com o desenho definitivo.
- Callback `onScene` e utilitários `[data-scene-step|track|drift]`, sem consumidor no momento.

### Fixed
- O `data-chapter` do `body` era capturado pelo seletor do trilho e criava um capítulo fantasma.
  O atributo virou `data-active-chapter`.
- A entrada zerava a opacidade em 59% da cena e deixava tela vazia antes de liberar a página.

## [0.2.0] — 2026-09-03 · Sprint 0.1 · Auditoria e endurecimento

### Added
- `js/scroll.js`: orquestrador único de rolagem. Um listener com `rAF` e um `IntersectionObserver`
  para a aplicação inteira, publicando capítulo ativo, progresso de cena e progresso da narrativa.
- Padrão de movimento `scene`: seção alta com palco `sticky` e `--scene-progress` dirigindo
  etapas de conteúdo, números e trilha de avanço.
- Chrome reativo: capítulo ativo e fio de progresso da narrativa na base.
- Trilho lateral de capítulos, visível a partir de 1024.
- Open Graph e favicon — o preview do link é o primeiro contato dela com o projeto.
- `state.save()` exposto, cumprindo o contrato `hydrate / save / reset` já documentado.
- `people` em `data.js`, eliminando a duplicação das duas pessoas no `app.js`.

### Changed
- **Mel** passa a ser **Mel Pitica** em todo o projeto.
- `[data-reveal]` virou reversível: rolar de volta desfaz a entrada. Antes chamava `unobserve`
  e o efeito acontecia uma única vez.
- Padrão `sheen` aposentado em favor de `scene` — era decorativo e não conduzia narrativa.
- `overflow-x` do `body` passou de `hidden` para `clip`, que não cria contexto de rolagem.
- `prefers-reduced-motion` passou a desligar também palcos fixos e a revelar todas as etapas.

### Removed
- Tokens nunca consumidos: `--display-xl`, `--leading-snug`, `--radius-lg`, `--shadow-sm`,
  `--shadow-lg`, `--shadow-accent`, `--ease-in-out`, `--color-surface-3` e os `--z-*` sem uso.

### Fixed
- Glifo `›` do boot log virava mojibake: servidores estáticos entregam CSS sem charset.
  Passou a ser escapado como `'\203A'`.
- Ideias vindas do `localStorage` agora são validadas antes de entrar no estado.

## [0.1.0] — 2026-09-03 · Sprint 0 · Foundation

### Added
- Estrutura do projeto, `.gitignore` e `robots.txt` bloqueando indexação.
- `css/tokens.css`: paleta dark premium com accent champagne, escala tipográfica em `clamp()`,
  espaço, raio, sombra, movimento e camadas.
- `css/base.css`: reset, fundações tipográficas, foco visível, skip link e
  `prefers-reduced-motion` neutralizando movimento de verdade.
- `css/layout.css`: chrome persistente do OS, container editorial e grade assimétrica de 12 colunas.
- `css/components.css`: eyebrow, painel, métrica, medidor, botões, status, controles de voto.
- `css/animations.css`: os quatro padrões de movimento — reveal, stagger, lift e sheen.
- `css/responsive.css`: mobile-first com alvos em 375, 768, 1024 e 1440.
- `js/data.js`: lista original completa como dado — 19 decisões, convidados, line-up,
  experiências, áreas do mapa, lua de mel, patrocínio, timeline e easter eggs.
- `js/storage.js`: única camada com acesso a `localStorage`, namespace `weddingos:*`,
  schema versionado e degradação silenciosa quando a persistência não está disponível.
- `js/state.js`: fonte única de verdade com pub-sub, `hydrate` / `save` / `reset`,
  votação por pessoa e métricas derivadas de progresso e compatibilidade.
- `js/app.js`: bootstrap e tela de diagnóstico da fundação.
- Documentação: `README`, `docs/PRODUCT.md`, `docs/DESIGN.md`, `docs/SPRINTS.md`.

### Changed
- Fontes passam a ser carregadas via Google Fonts CDN em vez de self-hosted: como a entrega
  é por link publicado, a rede já é pré-requisito e o self-host deixou de ter benefício real.

### Fixed
- Caminhos de assets tornados relativos (`./css/…`) para funcionar no subdiretório
  `/wedding/` do GitHub Pages.
- Overflow horizontal em 375px: os 11 gaps da grade de 12 colunas somavam mais que a largura
  do container. O gap de coluna foi reduzido e o mobile passou a colapsar de fato em coluna única.
- Marcas de voto passaram de emoji para glifos tipográficos, para herdarem a cor dos tokens.

### Security
- Item de drogas da lista original substituído por `[REDIGIDO PELO DEPARTAMENTO JURÍDICO]`.
- Disclaimer de ficção no rodapé, `noindex` e `robots.txt`, dado o repositório público.
