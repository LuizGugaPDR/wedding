# Wedding OS · 13.03

> Um sistema operacional de luxo para um casamento que não deveria existir.

Durante um date, um casal escreveu uma lista absurda sobre como seria o casamento deles.
Este repositório transforma essa lista em uma aplicação web que se leva absurdamente a sério.

O humor não está no conteúdo — está na seriedade da interface tratando "2 anões tequileiros"
como um item de infraestrutura crítica, com peso de risco e status de aprovação.

**Tudo aqui é ficção.** Nenhuma das pessoas, marcas ou locais citados tem qualquer relação
com este evento.

---

## Objetivo

O frontend é o produto. Prioridade, nesta ordem:

`DESIGN` → `MICROINTERAÇÕES` → `NARRATIVA` → `ACABAMENTO`

## Stack

HTML5 semântico, CSS moderno (custom properties, grid, `clamp()`) e JavaScript ES6+ com
módulos nativos. **Sem framework, sem build step, sem backend, sem dependências em runtime.**

| Decisão | Motivo |
| --- | --- |
| Sem GSAP | CSS + `IntersectionObserver` + Web Animations API cobrem os quatro padrões de movimento. Economiza ~50kb. |
| Sem build step | `git clone` e servir. Nada para compilar. |
| Google Fonts via CDN | A entrega é por link, então a rede já é pré-requisito. Self-host não traria benefício real. |
| Caminhos relativos (`./css/…`) | GitHub Pages de repositório serve em `/wedding/`; caminho absoluto quebraria. |
| `canvas-confetti` por `import()` dinâmico | ~3kb baixados só no clique final, na Sprint 8. Custo zero no load. |

## Como executar

ES modules não funcionam por `file://` — é preciso um servidor estático trivial.

No VS Code, a extensão **Live Server** → botão *Go Live*. Ou, pelo terminal:

```bash
python -m http.server 4173
```

Depois abra <http://localhost:4173>.

> **Cache.** `python -m http.server` não envia `Cache-Control`, e o navegador serve CSS antigo
> mesmo depois de você salvar. Se uma alteração não aparecer, recarregue com `Ctrl+Shift+R`.
> O Live Server não tem esse problema.

Publicação: GitHub Pages a partir da branch principal, raiz do repositório —
<https://luizgugapdr.github.io/wedding/>

## Estrutura

```
index.html
css/     tokens · base · layout · components · animations · responsive
js/      app · data · state · storage · router · lock · scroll · interactions · countdown · dashboard · decisions · guests
docs/    PRODUCT · DESIGN · SPRINTS
```

| Arquivo | Responsabilidade |
| --- | --- |
| `js/data.js` | Todo o conteúdo. Nenhum texto de domínio nasce no HTML. |
| `js/state.js` | Fonte única de verdade, mutações e métricas derivadas. |
| `js/storage.js` | Única camada autorizada a tocar `localStorage`. |
| `js/router.js` | Roteador de views por hash. Uma só linguagem de transição. |
| `js/lock.js` | Acesso privado: cadeado, verificação e sequência de liberação. |
| `js/deck.js` | Paginação por medição: quebra a cena em etapas para nada precisar rolar. |
| `js/scenes.js` | A roda do mouse como gesto de navegação: recolhe o destino ao hub. |
| `js/scroll.js` | Único lugar que observa viewport. Reveal de blocos. |
| `js/interactions.js` | Resposta ao ponteiro e atração magnética. |
| `js/countdown.js` | Contagem regressiva para 13.03.2027 e dias até o deadline. |
| `js/dashboard.js` | Control Center e índice de destinos do hub. |
| `js/decisions.js` | Conselho, motor de decisões e nova ideia. |
| `js/guests.js` | Guest Intelligence: as três camadas e o cadastro de convidados. |
| `css/tokens.css` | Única fonte de cor, espaço, raio, sombra e duração. |

## Navegação por destinos

Wedding OS não rola. O `body` ocupa `100dvh` com `overflow: hidden` e cada destino é um estado
que ocupa a mesma tela.

- A Home é o **hub completo**: resumo do evento e índice dos oito destinos, tudo em uma tela.
- Cada destino é uma `[data-view]` com rota própria: `#home`, `#control-center`, `#guests`,
  `#decisions`.
- Conteúdo que não cabe é **paginado**, nunca rolado. O deck mede a altura livre e monta as
  etapas; um grupo grande demais é quebrado pelas próprias linhas, e todas continuam
  alcançáveis pelo pager.
- **Rolar para cima recolhe o destino ao hub.** É gesto, não rolagem. `Esc` e o `← UNIVERSE`
  fazem o mesmo.
- A transição é uma só: sai subindo, entra subindo, 200 ms + 380 ms.
- Sem JS nenhuma view fica escondida e os `href="#id"` voltam a ser âncoras — a experiência
  degrada para uma página longa em vez de sumir.

## Acesso privado

Na primeira visita o sistema está trancado. O cadeado abre a verificação, que pede a senha do
primeiro contato do casal. É encanto, não segurança: o repositório é privado, mas a frase mora
em `js/data.js`, à vista. A graça está na pergunta, não no segredo.

A validação ignora espaços nas pontas e caixa, mas mantém acento e pontuação.
**O acesso não persiste**: recarregar a página volta a pedir a senha, porque a entrada é o
momento e ele precisa acontecer toda vez. `BLOQUEAR WEDDING OS`, no rodapé, devolve o cadeado
no meio da sessão — é assim que dá para ensaiar antes de entregar o notebook.

## Estado

Persistido em `localStorage` sob `weddingos:v1`, com schema versionado — decisões novas
chegam com seu valor de fábrica sem quebrar estados antigos. API: `hydrate()`, `save()`, `reset()`.

- **Progresso** = decisões com os dois votos preenchidos ÷ total
- **Compatibilidade** = concordância ponderada por peso, entre o que já foi decidido pelos dois

`RESET WEDDING OS` limpa todas as chaves do namespace e restaura o estado de fábrica.

## Roadmap

Desenvolvimento em sprints, uma por vez. Detalhe e critérios de aceite em
[docs/SPRINTS.md](docs/SPRINTS.md).

`0 Foundation` ✅ → `1 Cinematic Entry` ✅ → `2 Dashboard` ✅ → `3 Decision Engine` ✅ →
`3.5 Summer Rework` ✅ → `3.6 Experience Foundation` ✅ →
`4 Guest List + Line-up` → `5 Experiences + Mapa` → `6 Honeymoon + After` →
`7 Easter Eggs` → `8 Emotional Ending` → `9 Polish`

## Privacidade

O site usa `noindex` e `robots.txt` bloqueando rastreadores. É público por link,
mas não indexável.
