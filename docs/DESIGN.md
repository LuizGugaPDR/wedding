# DESIGN · Wedding OS 13.03

## Conceito

> **Ice Wedding.** Gelo sofisticado, editorial de moda, sistema operacional privado.

A identidade é clara e fria na medida certa. Gelo como ar, coral como energia, oliva como
estado estável. O humor continua vindo do contraste entre a seriedade do sistema e o absurdo
do conteúdo — mas agora o sistema tem porta, e a porta pede uma senha ridícula.

| Camada | Função | Onde aparece |
| --- | --- | --- |
| Editorial | Bodoni em escala enorme, assimetria, sobreposição | Hero, índice do universo, títulos |
| Operação | Rótulos micro, números tabulares, fios | Control Center, chrome, status |
| Gráfica | Contorno, selo giratório, cadeado, pontos | Hero e lock screen |

## Cor

Todos os valores vivem em `css/tokens.css`. Nenhum componente declara cor literal.

| Token | Valor | Função |
| --- | --- | --- |
| `--color-ice` | `#EEF0EA` | Base. ~65% da área. Nunca branco puro |
| `--color-ice-deep` | `#E4E8DE` | Superfície de hover e vinheta |
| `--color-graphite` | `#202822` | Texto. Subtom esverdeado, nunca preto |
| `--color-coral` | `#FF5548` | Energia. **Só preenchimento e desenho** |
| `--color-coral-deep` | `#B3382A` | Coral quando é texto |
| `--color-olive` | `#68745B` | Tint e desenho secundário |
| `--color-olive-deep` | `#4D5844` | Oliva quando é texto |
| `--color-butter` | `#FFD447` | Descoberta. Micro-detalhe apenas |

Proporção de arte: ~65% gelo, 20% grafite, 10% coral, 5% oliva e contextuais.

### Cores têm função, não decoram

- **Coral** — ação, identidade, conflito, alerta, senha. `Negoçiação` e `veto` são coral.
- **Oliva** — acordo, operação, navegação. `Aprovação unânime` é oliva.
- **Manteiga** — descoberta. Hoje aparece em um ponto só: o marcador de segredos.

Sem verde e sem vermelho de semáforo: o par coral/oliva cumpre o papel sem virar dashboard.
Não existe mais tema por seção — nenhuma tela é pintada de uma cor chapada saturada.

## Tipografia — duas famílias, sem exceção

- **Display:** `Archivo Black` — grotesk preta de verdade. Os nomes precisam de peso, não de
  elegancia fina; a serifada anterior deixava a Home com cara de convite editorial parado.
- **UI:** `Space Grotesk` — contemporânea, com personalidade suficiente para o feel de "OS"
  sem virar fonte de terminal.

Archivo Black tem **um peso só e nenhum itálico**: nada no projeto pode pedir bold ou itálico
dela, sob pena de o navegador sintetizar a força. Ela também é bem mais larga que a serifada
anterior — daí os nomes terem escala própria (`--display-names`) e o rótulo dos destinos
encolher em 320px.

Não existe família mono. A sensação de "OS" vem de `letter-spacing: .18em` + uppercase +
`font-variant-numeric: tabular-nums` (classe `.tabular`) em labels de 10–11px.
Números que mudam ao vivo — countdown, percentuais — usam sempre `.tabular` para não dançar.

**A tela de acesso é a exceção.** Ela manteve `Bodoni Moda` + `Inter`, sobrescrevendo
`--font-display` e `--font-ui` dentro de `.lock`. Todo o componente consome os tokens, então
duas linhas bastam — e a revelação, que vive dentro do diálogo, vai junto. A porta também roda
um degrau abaixo da escala geral: ela não precisa gritar.

## Layout

Container único (`.shell`) e `.split` (7fr / 5fr) como composição assimétrica padrão.
Nunca quatro cards iguais: números viram lista editorial com fio, destinos viram índice
tipográfico gigante.

**Lock screen.** Barra operacional fixa no topo (`WEDDING OS · PRIVATE ACCESS · SESSION`),
fio coral de 2px na borda superior, `13.03` em Bodoni grande, cadeado em SVG e uma frase que
já entrega o tom da lista. Ao fundo, treze palavras da lista original **atravessam a tela sem
parar e sem nunca desbotar** — cada uma cruza a largura inteira em 43 a 73 segundos, metade
para cada lado (`animation-direction: reverse`). O `animation-delay` é **negativo** e proporcional
à duração: no primeiro quadro as treze já estão espalhadas pelo caminho, sem fila na borda.
Elas usam **Inter, não Bodoni**: em corpo pequeno o contraste de hastes da display fecha as
letras. Passar o mouse acende a palavra em coral e liga um segundo impulso mais rápido: a
travessia mora no pai, o impulso no filho, e os dois `translate` se compõem sem salto.

As palavras são para **ler**, não para adivinhar: 4,5:1 medidos sobre o ponto mais escuro do
degradê. Quem garante a leitura do painel não é o apagamento delas — é uma **coluna de gelo
opaca que corre a tela de cima a baixo**, na largura do painel (`.lock::after`). As palavras
passam por trás e são cortadas por uma aresta vertical contínua: uma divisão editorial, e não
um card parado no meio do nada. A coluna é `position: fixed`, então `.lock` precisa de
`scrollbar-gutter: stable both-edges` — sem isso a barra de rolagem empurra o painel 7px e ele
sai do eixo da coluna.

Mover o ponteiro deixa um **rastro de corações** coral de ~20px, um a cada 52px percorridos,
no máximo dez ao mesmo tempo, cada um vivendo 900ms. É a única exceção ao "sem corações" da
direção de arte, pedida para esta tela e restrita a ela.

**Revelação.** Depois de `ACCESS GRANTED` a tela **explode**: cerca de 14 cópias da foto do casal,
em tamanhos de 5 a 14rem, e ~37 corações saem do centro em três ondas (0, 230 e 500ms). A
primeira onda é a maior — é ela que lê como explosão; as outras duas são o rastro. Cada peça
viaja de meia a uma diagonal e meia, girando, e some fora da tela em ~1,5 a 2,2s.
A camada (`.lock__burst`) fica **fora** da revelação de propósito: dentro dela nasceria junto
com o fade de 1,5s e a explosão sairia lavada.

Quando a poeira baixa, a foto do casal já subiu no centro, com
`Evidência 001` acima e a legenda em Bodoni abaixo, sob uma chuva rala de corações. Fica parada
por **7s** — tempo de ler sem pressa — e **some de uma vez**. No mesmo instante o OS entra em
fade, com o chrome, o conteúdo e o rodapé escalonados: a foto sai em corte, o sistema chega
inteiro. Um clique ou uma tecla encerra antes, para nunca prender ninguém. A imagem é o único
ativo remoto do projeto: se não carregar, a etapa inteira é pulada.

**Campo técnico.** O fundo do cadeado não é papel em branco: uma malha fina de oliva a 13%
anda uma célula a cada 46s e três anéis de sonar nascem atrás do cadeado, morrendo antes de
tocar a borda. Na verificação o sonar dobra de velocidade — o sistema está procurando alguém.
Futurista pelo desenho, não por neon: continua tudo gelo, oliva e coral.

Na verificação a marca recua, a pergunta assume o peso editorial e entra o dossiê: registro,
tentativas e a dica de que a senha termina em interrogação. O fio coral engrossa por um
instante quando a senha é recusada.

**Hero.** É a **única view sem `.shell`**: quem limita a largura é o conteúdo, não a seção.
Assim a camada gráfica sangra de borda a borda com `inset: 0` — em `100vw` ela passaria da
largura útil pela barra de rolagem e criaria rolagem horizontal.

O fundo tem quatro manchas radiais difusas (pêssego, manteiga, sálvia e azul gelo), cada uma
na sua profundidade, e um `wash` claro pintado por cima delas que devolve contraste à coluna
do texto sem apagar a cor das beiradas. Os centros ficam fora da tela: nenhuma vira um círculo
visível.

O `13.03` deixou de ser contorno cortado no rodapé e virou número **preenchido** em coral a 15%,
grande, atravessado pela composição. Não disputa com os nomes porque não tem peso de tinta.
Quatro pedaços da história (`Galo airspace`, `After protocol`, `150 convidados`,
`Decisões questionáveis`) ficam nas folgas da composição, em corpo de rótulo e opacidade baixa —
e somem quando a folga acaba (abaixo de 1088px ou em janela baixa).

Os nomes são o protagonista em `--display-names`, duas linhas, peso máximo. O countdown é
informação de apoio: corpo de UI e não de display, com rótulo em cima. A Hero **não** ocupa a
tela inteira: o índice de destinos precisa espiar por baixo.

**Wedding Universe.** Oito destinos como linhas tipográficas. Hover desloca a linha, colore o
índice em coral, revela a descrição, mostra a seta e muda pouquíssimo o fundo. Destinos ainda
não construídos ficam visíveis e clicáveis: respondem com uma mensagem operacional.

**Control Center.** Página editorial de dados. `readiness` em escala grande, dez leituras em
fio com valor acima e legenda abaixo. As duas métricas de decisão são links — é o que faz o
conjunto parecer sistema conectado, não painel.

O **chrome persistente** carrega marca, breadcrumb, `← UNIVERSE` e prontidão.
Ele só existe depois do desbloqueio.

## Movimento — no máximo quatro padrões

| Padrão | Classe / atributo | Uso |
| --- | --- | --- |
| Reveal | `.js [data-reveal]` + `.is-revealed` | Entrada de bloco no viewport, **reversível** |
| Stagger | `--reveal-index` | Cascata dentro de um bloco |
| View | `[data-view-state]` | Troca de destino: sai subindo, entra subindo |
| Alert | `[data-denied]`, `[data-live]` | Recusa de senha e indicador vivo do acesso |

**Movement follows intent.** Nada anima sozinho — as únicas exceções são o selo giratório da
Hero e a pulsação do indicador de verificação, ambas paradas com `prefers-reduced-motion`.

A transição entre views é **uma só linguagem**: 200 ms saindo para cima, 380 ms entrando de
baixo. Nenhuma tela ganha efeito próprio.

`js/interactions.js` publica a posição normalizada do ponteiro e cada camada decide o quanto se
desloca (`data-pointer-layer`). O CTA tem atração magnética limitada a 14px. Tudo desliga em
tela sem hover fino ou com movimento reduzido.

`data-reveal-once` desliga a reversibilidade em elementos de dado — uma barra que zera ao sair
de vista parece falha de renderização, não narrativa.

Nenhum padrão novo sem substituir um destes.

## Navegação por destinos

Wedding OS não é uma página que rola. Cada experiência é um destino em tela cheia.

```
#home             hero + índice do 13.03 Universe   (hub)
  |  clique num destino
#control-center   prontidão, riscos e cronograma    (aberto)
  |  DECISIONS PENDING
#decisions        conselho + motor de decisões
  |  <- UNIVERSE volta ao hub
```

`js/router.js` guarda a rota no hash, esconde as outras views e devolve o foco. A rolagem
interna existe só quando o conteúdo de um destino pede — nunca para trocar de destino.

`js/scroll.js` deixou de ser motor de narrativa: sobrou o reveal, e ele continua sendo o único
lugar que observa viewport.

## Acesso privado

O cadeado é um `<dialog>` nativo: foco preso e camada superior vêm de graça. Esc não fecha o
acesso — ele recua da verificação para a porta fechada.

A sequência de liberação dura ~1,9s: `Validating...` → `Match found.` →
`First contact verified.` → a haste do cadeado gira → `ACCESS GRANTED`.

A senha mora em `js/data.js`, à vista, porque o repositório é público. Isso é encanto,
não segurança, e o código diz isso em comentário para ninguém confundir depois.

## Responsividade

Mobile-first. Alvos validados: **320 · 375 · 768 · 1024 · 1366×660 · 1440 · 1920**.
Abaixo de 768 o chrome mantém apenas marca, volta e prontidão; o índice de destinos abre a
descrição e o status sempre, porque no toque não existe hover.

**Janela baixa cobra respiro.** Em 1366×660 e 320×640 a Hero precisa encolher para o
`EXPLORE O 13.03` continuar dentro da dobra — senão o botão que leva ao índice fica escondido
atrás de uma rolagem que ele mesmo deveria dispensar.

**O teclado do celular come metade da tela.** Na verificação o painel alinha ao topo em vez
de centralizar, para o campo não sumir sob o teclado.

**Coluna estreita quebra palavra.** `Aguardando liberação` em Bodoni de 48px só cabe a partir
de 16rem de coluna; abaixo disso o valor cai para o tamanho de UI em vez de partir ao meio.

Zero overflow horizontal — garantido por `overflow-x: clip` no `body` e medido em toda rota,
em todo estado do cadeado.

## Aprimoramento progressivo

A experiência é entregue por link, aberta no celular. Uma falha de rede não pode virar tela preta.
Quatro camadas, nesta ordem:

1. O texto da entrada existe no HTML. `data.js` sobrescreve em execução normal.
2. `[data-reveal]` só esconde sob `.js`, classe adicionada antes da primeira pintura.
3. Um vigia revela tudo se `data-booted` não aparecer em 1,5s.
4. O boot roda dentro de `try/catch` que revela tudo, **fecha o cadeado** e registra a falha.

O cadeado também degrada: sem JS ele nunca recebe `open` e some, e as views ficam todas
visíveis como uma página longa. O convite nunca desaparece atrás de uma porta quebrada.

## Acessibilidade

Foco visível com o accent, `.skip-link`, `<button>` real para ações e `<a>` para navegação,
`aria-label` descritivo onde o texto visível não basta. Trocar de view move o foco para a view.

Contraste medido sobre gelo `#EEF0EA`:

| Token | Contraste | AA |
| --- | --- | --- |
| `--color-graphite` `#202822` | 13.2:1 | ✓ |
| `--color-olive-deep` `#4D5844` | 6.5:1 | ✓ |
| `--color-text-dim` `#5A6359` | 5.4:1 | ✓ |
| `--color-coral-deep` `#B3382A` | 5.2:1 | ✓ |
| `--color-text-faint` `#646D62` | 4.7:1 | ✓ |
| `--color-coral` `#FF5548` | 2.8:1 | só preenchimento e desenho |

Sobre coral usa-se `graphite` (4.8:1). Sobre manteiga, `graphite` (10.6:1).

**Medir sobre o tint, não sobre a base.** `Aprovação unânime` é oliva sobre um tint de oliva a
14%. Contra o gelo puro a oliva clara passava; contra o próprio tint ela caiu para 4.2:1.
Por isso a oliva de texto (`#4D5844`) é mais escura que a oliva de fundo (`#68745B`).

