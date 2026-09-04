# SPRINTS · Wedding OS 13.03

**Regra crítica:** uma sprint por vez. Ao concluir, parar, reportar e aguardar autorização.

Legenda: ✅ concluída · ▶️ em andamento · ⬜ não iniciada

---

## ✅ Sprint 0 — Foundation

**Objetivo:** base limpa, documentada e pronta. Nenhuma tela final.

**Entregáveis**
- Estrutura de diretórios, `.gitignore`, `robots.txt`
- `css/tokens.css` como única fonte de valores
- `base` · `layout` · `components` · `animations` · `responsive`
- `js/data.js` com a lista original completa
- `js/storage.js` (única camada que toca `localStorage`) e `js/state.js` (fonte de verdade + pub-sub)
- `README`, `CHANGELOG`, `PRODUCT`, `DESIGN`, `SPRINTS`
- Tela de diagnóstico da fundação

**Critérios de aceite**
- [x] Console sem erros
- [x] Voto persiste após recarregar
- [x] `RESET WEDDING OS` volta ao estado de fábrica
- [x] Progresso inicial 37% e compatibilidade 87%
- [x] Sem overflow horizontal em 375px
- [x] `prefers-reduced-motion` neutraliza movimento
- [x] Nenhum arquivo vazio

---

## ✅ Sprint 0.1 — Auditoria e endurecimento

**Objetivo:** corrigir os achados da auditoria antes de qualquer capítulo de conteúdo existir.

**Entregáveis**
- `js/scroll.js`: orquestrador único de rolagem — capítulos, cenas, progresso da narrativa
- Padrão `scene` substituindo o `sheen` aposentado; `[data-reveal]` agora reversível
- Chrome reativo (capítulo ativo + fio de progresso) e trilho lateral de capítulos
- `state.save()` exposto, cumprindo o contrato documentado
- Open Graph, favicon, `overflow-x: clip`, tokens mortos removidos

**Critérios de aceite**
- [x] Palco `sticky` gruda abaixo do chrome
- [x] `--scene-progress` vai de 0 a 1 e dirige etapa e número
- [x] Capítulo ativo e trilho acompanham a rolagem
- [x] `prefers-reduced-motion` desliga palco fixo e revela todas as etapas
- [x] Sem overflow horizontal em 375 / 768 / 1024 / 1440
- [x] Console sem erros

---

## ✅ Sprint 1 — Cinematic Entry

**Objetivo:** a primeira tela precisa causar impacto sozinha.

**Entregáveis**
- Entrada em cena `sticky`: nomes, tagline, local, data e convidados renderizados de `data.js`
- `js/countdown.js` — contagem regressiva ao vivo para 13/03/2027 e dias até o deadline
- CTA que marca `prefs.entered` e conduz ao capítulo seguinte
- Chrome e trilho ocultos durante a entrada; entram junto com o capítulo 01
- Segunda visita pula a abertura longa e troca o rótulo do CTA
- `RESET WEDDING OS` movido para o rodapé, sempre acessível
- Tela de diagnóstico da Sprint 0 removida, junto com todo o CSS que a servia

**Critérios de aceite**
- [x] Countdown com numerais tabulares, sem saltos
- [x] A entrada recua até sumir sem deixar tela vazia antes de liberar a página
- [x] `prefs.entered` sobrevive ao reload e altera a segunda visita
- [x] Cabe inteira em 375×667 sem corte
- [x] Sem overflow horizontal em 375 / 768 / 1024 / 1440
- [x] `prefers-reduced-motion` desliga o palco fixo e mantém tudo legível
- [x] Console sem erros

---

## ✅ Sprint 1.1 — Correções da auditoria

**Objetivo:** zerar os achados da auditoria antes do dashboard.

**Critérios de aceite**
- [x] Com os módulos bloqueados, a página continua legível: 10/10 blocos visíveis, nomes,
      data e CTA funcionando
- [x] `--color-text-faint` mede 4.71:1 — disclaimer de ficção aprovado em AA
- [x] Todos os grupos de `<dl>` com `dt` antes de `dd`, valor ainda acima do rótulo
- [x] `og:image` responde 200 e o card virou `summary_large_image`
- [x] Nenhuma classe, token ou export sem consumidor
- [x] Sem overflow horizontal em 320 / 375 / 768 / 1024 / 1440
- [x] Console sem erros

---

## ✅ Sprint 2 — Wedding Dashboard

**Objetivo:** transformar o pouso da entrada em painel de verdade.

**Entregáveis**
- `js/dashboard.js`: capítulos 01 (Visão geral) e 02 (Cronograma)
- Visão geral como cena: `37% organizado` e `87% compatibilidade` sobem de zero durante os
  primeiros 45% da travessia e travam no valor de `state.js`
- Faixa de compatibilidade humorística derivada do percentual
- Lista editorial de números com fio — 150 convidados, 19 decisões, 02 anões, 01 Galo, `???`
- Cronograma com duas barras (tempo decorrido × organização) e as três datas-marco
- `onScene` de volta ao motor de rolagem, agora com consumidor real

**Critérios de aceite**
- [x] Nenhuma composição de quatro cards iguais
- [x] Todo número vem de `state.selectors` ou `data.js`
- [x] O progresso do chrome e o do dashboard nunca divergem
- [x] Medidor acompanha a rolagem sem atraso
- [x] Trilho de capítulos não sobrepõe o conteúdo em 1024 / 1280 / 1440 / 1920
- [x] `prefers-reduced-motion` entrega os valores finais direto
- [x] Sem overflow horizontal em 320 / 375 / 768 / 1440
- [x] Console sem erros

---

## ✅ Sprint 2.1 — Correções da auditoria

**Critérios de aceite**
- [x] Nenhuma seção de `main` sem cabeçalho; hierarquia `h1 → h2 → h2`
- [x] Varredura programática de CSS: **zero** seletores sem consumidor nos seis arquivos
- [x] Barras mantêm o valor após sair de vista (249px → 249px)
- [x] Marcos com `<time datetime>` correto, deadline em `2027-02-13`
- [x] Escritas no DOM por rolagem caíram de 60 para 34 em 60 quadros
- [x] Palco fixo cabe em 320×640, 360×640, 375×667, 390×844, 768×1024
- [x] Console sem erros

---

## ✅ Sprint 3 — Decision Engine

**Objetivo:** o Wedding OS deixa de ser algo para ler e vira algo que o casal usa junto.

**Entregáveis**
- `js/decisions.js` com os capítulos `03 · Conselho` e `04 · Decisões`
- 19 decisões agrupadas por categoria, cada uma com voto duplo Luiz / Mel Pitica
- Status derivado: aprovação unânime, veto unânime, negociação necessária, em análise, pendente
- Cada voto recalcula progresso, compatibilidade e capítulo 01 ao vivo
- `+ NOVA IDEIA` em `<dialog>` nativo, com proponente, categoria e prioridade
- Ideias viram decisões de primeira classe: entram no grupo, contam no progresso e persistem
- Wedding Executive Board com os dois cargos e suas alçadas

**Critérios de aceite**
- [x] Um voto muda status, progresso do chrome e medidores do dashboard na mesma ação
- [x] Modal com foco preso, `Esc` fecha e o foco volta ao gatível de origem
- [x] Nova ideia nasce **Em análise**, no grupo escolhido, com o voto de quem propôs
- [x] Fechar e reabrir o navegador não perde ideias nem votos
- [x] Feedback visível só quando o veredito muda, não a cada clique
- [x] Sem overflow horizontal em 320 / 375 / 768 / 1366 / 1440
- [x] Zero seletor de CSS sem consumidor
- [x] `prefers-reduced-motion` desliga o pulso e mantém tudo legível
- [x] Console sem erros

---

## ✅ Sprint 3.1 — Correções da auditoria

**Critérios de aceite**
- [x] `.lede` com cor secundária, medida de 42ch e escala correta
- [x] Título só com espaços é barrado, com mensagem em português
- [x] Varredura de CSS **nos dois sentidos** limpa: zero seletor sem elemento,
      zero classe sem regra, zero token fantasma
- [x] Sem overflow horizontal em 320 / 375 / 768 / 1366 / 1440
- [x] Console sem erros

---

## ✅ Sprint 3.5 — Summer Experience Rework

**Objetivo:** abandonar a atmosfera escura e conservadora. A mudança tem que ser percebida
imediatamente — não "mudamos algumas cores", e sim "parece outro produto".

**Entregáveis**
- Design system Mediterranean: creme, coral, azul mediterrâneo, amarelo de descoberta
- Temas por capítulo via `[data-theme]`; Control Center em azul de tela
- Hero reconstruída: nomes gigantes, `13.03` em contorno coral sangrando, selo giratório,
  countdown na coluna direita, CTA magnético
- `js/interactions.js`: ponteiro normalizado e atração magnética
- **The 13.03 Universe**: índice tipográfico de oito destinos, com trancados sinalizados
- Control Center com dez leituras — readiness, guests, artistas, segredos, riscos
- Sexto Easter Egg previsto (`Classified`)

**Critérios de aceite**
- [x] Preto deixou de ser fundo; creme ocupa a maior parte da área
- [x] Coral tem presença e função; azul mediterrâneo integrado
- [x] Hero ocupa o viewport, com o `13.03` como elemento gráfico
- [x] Wedding Universe existe e responde ao ponteiro
- [x] Ponteiro produz feedback; tudo desliga sem hover fino
- [x] Estado anterior preservação total: votos, ideias, progresso, reset
- [x] Contraste: **zero** reprovação em creme e em azul
- [x] CTA e countdown visíveis em 320×640 até 1920×1080 (9 tamanhos)
- [x] Zero seletor sem elemento, zero classe sem regra, zero token fantasma
- [x] Console sem erros

---

## ✅ Sprint 3.6 — Experience Foundation

Correção de três decisões fundamentais: paleta, modelo de navegação e experiência de entrada.
Nenhum conteúdo novo — só a fundação.

**Entregue**

- Identidade **Ice Wedding**: gelo, grafite esverdeado, coral, oliva, manteiga em detalhe.
  O azul de tela cheia do Control Center saiu por completo.
- `js/router.js`: navegação por views no hash, com uma única linguagem de transição.
- `js/lock.js`: cadeado em `<dialog>` nativo, verificação, recusa integrada e sequência
  de liberação.
- Hub do 13.03 Universe com os oito destinos; um aberto, sete respondendo por que não abrem.
- Control Center recomposto como página editorial de dados, com métricas que abrem outra view.
- `BLOQUEAR WEDDING OS` no rodapé.

**Critérios de aceite**

- [x] Primeira visita tranca; senha errada dá feedback sem `alert()`; certa libera
- [x] `já posso?`, `JÁ POSSO?` e `   JÁ POSSO?  ` funcionam
- [x] Refresh mantém desbloqueado; `BLOQUEAR` re-tranca e sobrevive ao refresh
- [x] Hub → Control Center → back → hub, e o botão voltar do navegador
- [x] A rolagem não troca de destino em nenhum ponto
- [x] Contraste: **zero** reprovação em 6 estados (trancado, recusado, hub, hover, CC, decisões)
- [x] Zero overflow horizontal em 7 tamanhos × 5 estados
- [x] CTA dentro da dobra e índice espiando por baixo, de 320×640 a 1920×1080
- [x] Zero seletor sem elemento, zero classe sem regra, zero token fantasma
- [x] Votos, ideias, progresso, countdown e reset intactos
- [x] `prefers-reduced-motion` neutraliza transição de view, pulsação e cadeado
- [x] Console sem erros

---

## ⬜ Sprint 4 — Guest Intelligence + Festival 13.03

## ⬜ Sprint 5 — Wedding Experiences + Mapa

Experiências e mapa conceitual em SVG com pontos interativos.

**Critérios:** mapa navegável por teclado; detalhe acessível sem depender de hover;
sem dependência de mapas externos.

---

## ⬜ Sprint 6 — Honeymoon + After

Rota Rosa → Caribe → Grécia e o After Protocol para a Arena MRV.

**Critérios:** transição dramática com saída óbvia; nada afirma que o after realmente acontecerá lá.

---

## ⬜ Sprint 7 — Easter Eggs

Galo Protocol, Snoop Mode, After Protocol, Casar Agora, `13.03`.

**Critérios:** não disparam por acidente; descobertas persistem; contador `n / 5` no chrome;
modos temporários têm saída clara.

---

## ⬜ Sprint 8 — Emotional Ending

Relationship changelog, botão `CASAR AGORA` com confirmação, confetti, mensagem final.

**Critérios:** quebra de ritmo real — o chrome do OS sai de cena;
`canvas-confetti` carregado por `import()` dinâmico apenas no clique.

---

## ⬜ Sprint 9 — Polish

Nenhuma feature nova. Espaçamento, tipografia, animações, mobile, hover, transições,
performance, acessibilidade, consistência, bugs.

**Critérios:** quality gate do `copilot-instructions.md` inteiramente verde.
