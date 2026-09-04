# Wedding OS — 13.03 · Instruções para agentes de IA

## Contexto do projeto

Experiência web premium, **frontend-only**, que transforma uma lista absurda criada por um casal
durante um date em uma aplicação interativa, cinematográfica e memorável.

| Fato | Valor |
| --- | --- |
| Identidade | `13.03` |
| Local | Aflora Secreta |
| Convidados | 150 |
| Deadline de pendências | 13/02/2027 |
| Data do casamento | 13/03/2027 |
| Noivo | Luiz |
| Noiva | Mel Pitica |
| Repositório | `LuizGugaPDR/wedding` — **público** |
| Publicação | GitHub Pages em `/wedding/` |

Esses valores vivem em `js/data.js`. **Nunca duplicar em HTML, CSS ou outro módulo.**

**O frontend é o produto.** Prioridade absoluta, nesta ordem:
`DESIGN` → `MICROINTERAÇÕES` → `NARRATIVA` → `ACABAMENTO`.

O humor nasce do contraste: **interface extremamente sofisticada + conteúdo progressivamente absurdo.**

## Regra crítica nº 1 — Sprints

**NUNCA implementar o projeto inteiro de uma vez.** Trabalhe uma sprint por vez.

Ao concluir uma sprint, PARE e reporte:

1. o que foi feito;
2. arquivos criados/alterados;
3. decisões técnicas tomadas;
4. como executar;
5. o que o usuário deve validar visualmente;
6. proposta para a próxima sprint.

**Não iniciar a sprint seguinte sem autorização explícita do usuário.**

Roteiro: `0 Foundation` → `1 Cinematic Entry` → `2 Dashboard` → `3 Decision Engine` →
`4 Guest List + Line-up` → `5 Experiences + Mapa` → `6 Honeymoon + After` →
`7 Easter Eggs` → `8 Emotional Ending` → `9 Polish`.

Detalhe e critérios de aceite ficam em `docs/SPRINTS.md`.

## Regra crítica nº 2 — Spec-Driven Development

Antes de codar qualquer feature relevante, defina (de forma leve, sem burocracia):
objetivo, comportamento esperado, critérios de aceite, impacto visual, impacto técnico, casos de borda.
Specs vivem em `docs/`. Não criar documento gigante para uma alteração pequena.

## Stack e restrições

**Permitido:** HTML5 semântico, CSS moderno (custom properties, grid, `clamp()`, container queries),
JavaScript ES6+ com módulos nativos, Google Fonts, GSAP (só se realmente agregar), Lucide Icons,
lib mínima de confetti.

**Proibido:** backend, banco de dados, Firebase/Supabase, autenticação, IA, APIs externas obrigatórias,
Docker/K8s, frameworks pesados (React/Vue/Angular/Next), Redux ou similares, TypeScript build chain
desnecessária.

A aplicação roda com um servidor estático trivial (Live Server ou `python -m http.server`) —
ES modules não funcionam por `file://`. **Não há Node instalado na máquina do usuário**, então não
sugerir `npx`/`npm`. Vite só como ferramenta de dev/build — **justificar antes de introduzir**.

`python -m http.server` não envia `Cache-Control`: o navegador serve CSS antigo e **toda
validação vira mentira**. Sempre recarregar ignorando cache antes de medir qualquer coisa.

Toda dependência nova exige justificativa de benefício perceptível pelo usuário final.

**Caminhos sempre relativos (`./css/…`).** O GitHub Pages serve o projeto em `/wedding/`;
qualquer caminho absoluto quebra em produção.

## Estrutura de diretórios

```
index.html
robots.txt
/assets/{images,icons}
/css/{tokens,base,layout,components,animations,responsive}.css
/js/{app,router,lock,scroll,state,storage,interactions,countdown,dashboard,decisions,guests,easter-eggs,data}.js
/docs/{PRODUCT,DESIGN,SPRINTS}.md
/.github/copilot-instructions.md
README.md
CHANGELOG.md
.gitignore
```

Ajustar apenas com motivo técnico claro. **Nunca criar arquivo vazio só para parecer profissional.**

## Arquitetura

- Princípios: SoC, DRY, KISS, YAGNI, responsabilidade única, baixo acoplamento, alta coesão.
- Clean Architecture / hexagonal apenas **conceitualmente**, onde trouxer benefício real.
  Nada de camadas artificiais em um frontend pessoal.
- **Arquitetura limpa e proporcional à complexidade.** Overengineering é bug.

### Data-driven UI

Conteúdo **não** fica espalhado no HTML. Centralizar em `js/data.js`:
`guests`, `attractions`, `decisions`, `experiences`, `mapAreas`, `honeymoon`, `timeline`, `easterEggs`.
A UI é renderizada a partir dessas estruturas.

### State management

Fonte única de verdade em `js/state.js`, persistida via `js/storage.js` com API explícita:

```js
hydrate()  // carrega do localStorage no boot
save()     // grava o estado atual
reset()    // RESET WEDDING OS — limpa tudo e volta ao estado inicial
```

- Nenhum componente escreve em `localStorage` diretamente — sempre através de `storage.js`.
- Mutações de estado disparam re-render/notificação (pub-sub simples é suficiente).
- Persistir: decisões (aprovado/em análise/vetado/pendente), progresso, novas ideias,
  Easter Eggs descobertos, preferências locais. **Acesso não se persiste.**
- **Ideias novas são decisões de primeira classe**: entram em `allDecisions()`, contam no
  progresso e têm votos persistidos. `mergePersisted` precisa aceitar os ids delas.
- Namespace de chaves: `weddingos:*`. Versionar o schema para não quebrar estados antigos.
- A função **RESET WEDDING OS** precisa ser acessível na UI e funcionar sempre.

## Direção de arte

**Ice Wedding**: gelo sofisticado, editorial de moda, sistema operacional privado.
A interface é clara e fria na medida certa. Contemporânea e confortável, nunca branca.

- **Evitar a todo custo:** branco puro, creme amarelado, preto ou dark mode como identidade,
  azul royal/cobalto preenchendo tela, cor chapada agressiva de tela cheia, um fundo saturado
  diferente por seção, template genérico de casamento, cara de Bootstrap, dashboard corporativo,
  landing SaaS, roxo genérico, neon cyberpunk, glassmorphism, gradientes espalhados, rosa de
  casamento, corações, cards para tudo, sombras pesadas, bordas arredondadas gigantes,
  grid de três cards.
- **Única exceção ao "sem corações":** o rastro do ponteiro, pedido explicitamente pelo
  usuário. Coral, ~20px, some em 900ms, no máximo dez ao mesmo tempo. Vale em **todas as
  telas**, não só no cadeado. Coração fora do rastro, da explosão do desbloqueio e da
  revelação continua proibido.
- Composição editorial: escala tipográfica enorme, assimetria intencional, sobreposição,
  formas gráficas (círculos, selos, contornos, fios) — nunca com cara de Canva.
- Proporção: ~65% gelo, 20% grafite, 10% coral, 5% oliva/manteiga e contextuais.

### Design tokens

Todo estilo consome tokens de `css/tokens.css`. Nenhum valor hardcoded em componentes.

| Token | Valor | Função |
| --- | --- | --- |
| `--color-cream` | `#F6EFE3` | Base. O papel do cardápio. Nunca branco puro |
| `--color-forest` | `#2F3D1E` | Texto. Verde floresta, nunca preto |
| `--color-terracotta` | `#E3792F` | Energia. **Só preenchimento e desenho** |
| `--color-terracotta-deep` | `#8A3E10` | Terracota quando é texto ou fundo de botão |
| `--color-burnt` | `#BF5B04` | Laranja queimado. Desenho e gradiente |
| `--color-coffee` | `#5C2A0A` | Marrom café. Fundo escuro de ação destrutiva |
| `--color-mint` | `#D7E0C4` | Superfície de acordo |
| `--color-sage` | `#A9BE8B` | Tint e desenho secundário |
| `--color-leaf` | `#7C9A5B` | Fio e mancha secundária |
| `--color-moss` | `#4B5320` | Verde quando é texto |
| `--color-peach` | `#F0B183` | Descoberta. Micro-detalhe apenas |

**Cor tem função, não decora.** Coral = ação, conflito, alerta, senha.
Oliva = acordo, operação, navegação. Manteiga = descoberta.
Sem verde e sem vermelho de semáforo. **Nenhuma tela é pintada de cor chapada saturada** —
não existe mais `[data-theme]`, e o projeto não volta a ser escuro.

Glifos não-ASCII em `content:` sempre escapados (`'\203A'`): servidores estáticos entregam CSS
sem charset e o caractere literal vira mojibake.

### Tipografia

Exatamente **2 famílias**: `Bodoni Moda` (display/editorial) e `Inter` (UI).
Sem família mono — o feel de "OS" vem de `letter-spacing: .18em` + uppercase +
`font-variant-numeric: tabular-nums` (classe `.tabular`) em labels de 10–11px.
Todo número que muda ao vivo usa `.tabular` para não dançar.
Hierarquia consistente em todo o projeto — nada de fonte diferente por seção.

### Animações

No máximo 4 padrões, definidos em `css/animations.css`. Hoje: `.js [data-reveal]` (reversível),
stagger via `--reveal-index`, `view` (troca de destino via `[data-view-state]`) e `alert`
(`[data-denied]` e `[data-live]`, do cadeado). **Nenhum padrão novo sem substituir um destes.**

**Uma só linguagem de transição entre views.** Nenhuma tela ganha efeito próprio.

**Movement follows intent.** Nada anima sozinho — exceções: o selo giratório da Hero e a
pulsação do indicador de verificação. Hover vive nos componentes, via `--transition-control`.
O ponteiro (`--pointer-x/y`, em `js/interactions.js`) responde ao usuário, nunca sozinho.

Proibido: elementos pulando, glow exagerado, partículas infinitas, animação em todo elemento,
efeito diferente a cada tela.

`@media (prefers-reduced-motion: reduce)` é **obrigatório** e deve neutralizar movimento de
verdade — inclusive a troca de view, o ponteiro e o rolar suave.

### Aprimoramento progressivo

A experiência é entregue por link e aberta no celular. **Falha de rede não pode virar tela preta.**

- Texto de tela crítica existe no HTML como fallback; `data.js` sobrescreve em execução normal.
  É a única duplicação de conteúdo permitida, e precisa vir comentada.
- `[data-reveal]` só esconde sob `.js`. Nunca escrever `[data-reveal]` sem o prefixo.
- `boot()` roda em `try/catch` que revela tudo **e fecha o cadeado** se algo explodir.
- Um vigia inline revela tudo se `data-booted` não aparecer.
- Sem JS as views não recebem `hidden` e os `href="#id"` voltam a ser âncoras comuns:
  a aplicação degrada para uma página longa em vez de sumir.

### Navegação por destinos

**Wedding OS não é uma página que rola. É uma aplicação de views em tela cheia.**

- A Home é o **hub**: hero curta + índice tipográfico dos oito destinos. Sem cards.
- Cada destino é uma `[data-view]` com rota no hash. `js/router.js` é o único dono da rota.
- **A rolagem nunca troca de destino.** Ela existe só dentro de uma view, quando o conteúdo
  realmente pede. Nada de `.scene`, palco `sticky` ou trilho de capítulos.
- Trocar de view move o foco para a view e volta ao topo.
- `js/scroll.js` sobrou como observador de viewport para o reveal. Componente nenhum escuta
  scroll por conta própria.
- O chrome persistente mostra marca, breadcrumb `13.03 / DESTINO`, `← UNIVERSE` e prontidão.
- Destino ainda não construído continua visível e clicável: responde com mensagem operacional,
  nunca fica inerte.

### Acesso privado

O cadeado é a primeira coisa que ela vê. É **encanto, não segurança** — o repositório é público
e a senha mora em `data.js`, à vista. Não tratar como credencial nem tentar ofuscar.

- `<dialog>` nativo com `showModal()`: foco preso e camada superior de graça.
- Esc não fecha o acesso; recua da verificação para a porta fechada.
- Validação ignora espaços nas pontas e caixa, mas **mantém acento e pontuação**.
- Recusa nunca usa `alert()` nem recarrega: feedback integrado, coral, curto.
- **O cadeado fecha a cada carregamento.** O acesso não persiste: recarregar volta a pedir
  a senha. É assim de propósito — a entrada é o momento, e ele precisa acontecer toda vez.
  `BLOQUEAR WEDDING OS` no rodapé devolve o cadeado no meio da sessão.

### Microinterações

Toda ação do usuário produz feedback claro: hover, botões, mudança de status, modais, tooltips,
progresso, countdown, menus, cards, cliques.

## Responsividade

Mobile-first desde o início. Breakpoints mínimos a validar: **320px, 375px, 768px, 1024px,
1366×660 e 1440px**. Mobile não é desktop encolhido — quando necessário, composição própria.
**Zero overflow horizontal**, medido em toda rota e em todo estado do cadeado.

O teclado do celular come metade da tela: telas com campo alinham ao topo, não ao centro.

## Acessibilidade

HTML semântico, contraste adequado, foco visível, navegação por teclado completa,
`aria-label` quando necessário, `alt` em imagens, `<button>` real para ações e `<a>` para navegação,
modais com foco preso e fechamento por `Esc`.

**Todo destino precisa de um cabeçalho real.** Eyebrow é decoração: tela sem `h2` não anuncia
nada para quem chega por teclado ou leitor de tela.

Modais usam `<dialog>` nativo. Atenção: o `* { margin: 0 }` do reset derruba o `margin: auto`
que centraliza o dialog — restaurar no componente.

**Piso de contraste: 4.5:1 sobre o fundo real do elemento.** Toda cor de texto nova precisa ser
medida **sobre o tint em que vai aparecer**, não sobre o gelo puro — foi aí que a oliva clara
reprovou. Coral e amarelo não servem como texto.
Nunca sacrificar acessibilidade por efeito visual.

## Performance

Lazy loading, imagens WebP/AVIF, sem vídeos pesados, sem libs gigantes, layout shift mínimo,
CSS antes de JS para efeitos simples. Meta conceitual: Lighthouse alto em
Performance, Accessibility e Best Practices.

## Conteúdo — regras de segurança editorial

O conteúdo é uma piada privada do casal e deve permanecer **claramente ficcional**.

- Não afirmar fatos reais sobre pessoas públicas citadas (Neymar, Vini Jr., Snoop Dogg, Anitta,
  Ronaldinho, Padre Marcelo Rossi, Kaio Jorge etc.). Usar status fictícios e evidentemente
  humorísticos: "convite não enviado", "presença improvável", "confirmado pelo departamento de delírio".
- Não transformar alegações humorísticas sobre terceiros (crimes, agressões, comportamentos)
  em afirmações factuais.
- Conteúdo adulto (dark room, acompanhantes, pole dance): sugestivo e humorístico, **nunca explícito
  ou pornográfico**.
- Maconha: o item entra como `[REDIGIDO PELO DEPARTAMENTO JURÍDICO]`. **Sem menção, instrução,
  incentivo, venda ou facilitação.**
- O repositório é público: manter o disclaimer de ficção no rodapé, `noindex` e `robots.txt`.
- Não usar logotipos oficiais de marcas (H2bet, Arena MRV) — apenas texto estilizado.
  Deixar claro que patrocínio e local do after são ficção.
- Final emocional: elegante, leve, sutil, compatível com início de relacionamento.
  **Não escrever declarações apaixonadas ou comprometedoras demais.**

## Easter Eggs

Meta: **5**, poucos e muito bem executados — Galo Doido (tirolesa), Snoop Mode,
After Protocol (Arena MRV), botão secreto de casamento, interação escondida em `13.03`.

- Não disparam o tempo todo; precisam parecer descoberta.
- Descobertas persistem em `localStorage`; indicador `3 / 5 segredos encontrados`.
- Modos temporários (Snoop Mode, After Protocol) precisam de saída clara e óbvia.

## Segurança

Sem secrets, tokens, credenciais ou chaves de API — em nenhuma hipótese.
Manter `.gitignore` adequado. Verificar ausência de dados sensíveis antes de sugerir commit.
Não expor informações pessoais desnecessárias no repositório.

## Documentação

`README.md`: visão, objetivo, stack, como executar, estrutura, decisões, roadmap.
`CHANGELOG.md`: seções `Added` / `Changed` / `Fixed`, atualizado ao fim de cada sprint.

## Quality Gate (antes de considerar concluído)

- [ ] Nenhuma seção parece template
- [ ] Nenhuma seção é conteúdo despejado sem composição
- [ ] Sem animações conflitantes
- [ ] Mobile funciona em 320/375/768/1024/1440
- [ ] Sem overflow horizontal em nenhuma rota
- [ ] CSS varrido nos dois sentidos: nenhum seletor sem elemento **e** nenhuma classe sem regra
- [ ] Estados persistem entre sessões
- [ ] Cadeado: toda visita tranca, senha errada dá feedback, certa libera
- [ ] `BLOQUEAR WEDDING OS` devolve o cadeado no meio da sessão
- [ ] `RESET WEDDING OS` funciona
- [ ] Navegação: hub → destino → back → hub, e o botão voltar do navegador
- [ ] Console sem erros
- [ ] Sem links quebrados nem imagens distorcidas
- [ ] Countdown, decisões, progresso e Easter Eggs funcionam
- [ ] `prefers-reduced-motion` funciona
- [ ] Sem secrets
- [ ] README e CHANGELOG atualizados

## Comportamento esperado do agente

Atue como engenheiro sênior, não como executor literal.

- Se houver abordagem visual ou técnica melhor, **proponha** — mas não altere escopo sem explicar.
- Durante o desenvolvimento: problema visual → corrija; duplicação → refatore;
  código morto → remova; experiência genérica → melhore.
- Não adicionar tecnologia desnecessária, backend, IA ou features enormes não pedidas.
- Não sacrificar qualidade para entregar mais rápido.

Antes de dar qualquer coisa por pronta, responda a si mesmo:

> **"Isso parece uma experiência feita especificamente para esse casal ou parece um template?"**
> Se parecer template: refazer.

> **"Isso vai impressionar quando eu abrir no notebook e entregar o computador para ela explorar?"**
> Este é o quality gate principal do projeto.

> **"Essa complexidade produz alguma melhoria perceptível?"**
> Se não: não adicionar.
