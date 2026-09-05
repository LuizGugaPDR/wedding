/**
 * Etapas dentro da mesma viewport.
 *
 * Nenhuma cena rola: o deck mede a altura livre e empacota os blocos já
 * renderizados em quantas etapas forem necessárias. Por medir em vez de assumir,
 * a mesma lista cabe em 1920 e em 320 sem depender de breakpoint.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Respiro entre a última linha e a navegação das etapas. */
const FOLGA = 12;

/** Espaço morto entre `de` e a borda interna de `ate`: paddings, margens, bordas. */
function cauda(de, ate) {
  let total = 0;
  for (let el = de; el && el !== ate; el = el.parentElement) {
    const cs = getComputedStyle(el);
    total += parseFloat(cs.paddingBottom) + parseFloat(cs.marginBottom) + parseFloat(cs.borderBottomWidth);
  }
  return total + parseFloat(getComputedStyle(ate).paddingBottom);
}

/**
 * @param {Element} host Container cujos filhos diretos são os blocos paginados.
 * @param {{ rotulo: string, linha?: string }} opcoes `linha` é o seletor das
 *   linhas internas de um bloco: com ele, um bloco maior que a tela é dividido
 *   em etapas em vez de estourar a cena.
 * @returns {{ sincronizar: () => void, inicio: () => void }}
 */
export function mountDeck(host, { rotulo, linha }) {
  const nav = document.createElement('div');
  nav.className = 'deck-nav';

  const passo = document.createElement('p');
  passo.className = 'deck-nav__step';

  const dots = document.createElement('div');
  dots.className = 'deck-nav__dots';
  dots.setAttribute('role', 'tablist');
  dots.setAttribute('aria-label', rotulo);

  const anterior = document.createElement('button');
  anterior.type = 'button';
  anterior.className = 'btn';
  anterior.textContent = 'Anterior';

  const proximo = document.createElement('button');
  proximo.type = 'button';
  proximo.className = 'btn';
  proximo.textContent = 'Próximo';

  nav.append(passo, dots, anterior, proximo);
  host.after(nav);
  host.setAttribute('data-deck', '');

  let paginas = [];
  let atual = 0;

  const limpar = () => {
    for (const el of host.querySelectorAll('[data-deck-hidden]')) el.removeAttribute('data-deck-hidden');
  };

  /** Mede com tudo visível: sem o atributo, o CSS devolve os blocos ao fluxo. */
  const empacotar = (ajuste) => {
    const itens = [...host.children];
    if (!itens.length) return [];

    host.removeAttribute('data-deck');
    itens.forEach((el) => el.removeAttribute('data-deck-active'));
    limpar();
    // Escondida, a navegação mede zero e o limite sairia otimista demais.
    const navOculta = nav.hidden;
    nav.hidden = false;

    const cena = host.closest('.view');
    const limite = cena
      ? Math.max(
          cena.getBoundingClientRect().bottom -
            cauda(nav.parentElement, cena) -
            host.getBoundingClientRect().top -
            nav.offsetHeight -
            parseFloat(getComputedStyle(nav).marginTop) -
            FOLGA -
            ajuste,
          140,
        )
      : Number.POSITIVE_INFINITY;
    const medidos = itens.map((el) => ({
      el,
      altura: el.getBoundingClientRect().height,
      linhas: (linha ? [...el.querySelectorAll(linha)] : []).map((r) => ({
        r,
        altura: r.getBoundingClientRect().height,
      })),
    }));

    nav.hidden = navOculta;
    host.setAttribute('data-deck', '');

    const pacotes = [];
    let pacote = [];
    let soma = 0;
    const fechar = () => {
      if (!pacote.length) return;
      pacotes.push(pacote);
      pacote = [];
      soma = 0;
    };

    for (const item of medidos) {
      // Bloco maior que a tela inteira: quebra pelas próprias linhas, sempre
      // alcançáveis pelo pager. Sem linhas conhecidas, vira etapa isolada.
      if (item.altura > limite && item.linhas.length > 1) {
        fechar();
        const moldura = item.altura - item.linhas.reduce((t, l) => t + l.altura, 0);
        const cabe = Math.max(limite - moldura, 0);
        let grupo = [];
        let alturaGrupo = 0;
        for (const l of item.linhas) {
          if (grupo.length && alturaGrupo + l.altura > cabe) {
            pacotes.push([{ el: item.el, linhas: grupo }]);
            grupo = [];
            alturaGrupo = 0;
          }
          grupo.push(l.r);
          alturaGrupo += l.altura;
        }
        if (grupo.length) pacotes.push([{ el: item.el, linhas: grupo }]);
        continue;
      }
      if (pacote.length && soma + item.altura > limite) fechar();
      pacote.push({ el: item.el, linhas: null });
      soma += item.altura;
    }
    fechar();
    return pacotes;
  };

  const mostrar = (indice, animar = true) => {
    if (!paginas.length) {
      nav.hidden = true;
      return;
    }
    atual = Math.max(0, Math.min(indice, paginas.length - 1));

    for (const pagina of paginas) {
      for (const entrada of pagina) entrada.el.removeAttribute('data-deck-active');
    }
    limpar();
    for (const entrada of paginas[atual]) {
      entrada.el.setAttribute('data-deck-active', '');
      if (!entrada.linhas) continue;
      for (const l of entrada.el.querySelectorAll(linha)) {
        if (!entrada.linhas.includes(l)) l.setAttribute('data-deck-hidden', '');
      }
    }

    if (animar && !reducedMotion.matches) {
      paginas[atual].forEach((entrada, i) => {
        entrada.el.animate(
          [
            { opacity: 0, transform: 'translate3d(0, 1.25rem, 0) scale(0.99)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 360, delay: i * 40, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' },
        );
      });
    }

    passo.textContent = `${atual + 1} / ${paginas.length}`;
    anterior.disabled = atual === 0;
    proximo.disabled = atual === paginas.length - 1;
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === atual)));
    // Uma etapa só não é etapa: a navegação some em vez de ficar inerte.
    nav.hidden = paginas.length < 2;
  };

  const sincronizar = () => {
    const alvo = atual;
    let ajuste = 0;
    let anterior = Number.POSITIVE_INFINITY;
    for (let tentativa = 0; tentativa < 3; tentativa += 1) {
      paginas = empacotar(ajuste);
      dots.replaceChildren(
        ...paginas.map((pagina, i) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'deck-nav__dot';
          dot.setAttribute('role', 'tab');
          const bloco = pagina[0]?.el;
          const titulo = bloco?.querySelector('h3, h4, .universe__label')?.textContent?.trim();
          const parte = pagina[0]?.linhas
            ? ` (${paginas.filter((p, j) => p[0]?.el === bloco && j <= i).length})`
            : '';
          dot.setAttribute('aria-label', titulo ? `${titulo}${parte}` : `${rotulo} ${i + 1}`);
          dot.addEventListener('click', () => mostrar(i));
          return dot;
        }),
      );
      mostrar(Math.min(alvo, Math.max(0, paginas.length - 1)), false);

      // Sobras que o cálculo não previu (linha que quebrou, fonte que carregou):
      // mede o estouro real e reempacota, desde que esteja de fato melhorando.
      const palco = host.closest('.view');
      const sobra = palco ? palco.scrollHeight - palco.clientHeight : 0;
      if (sobra <= 1 || sobra >= anterior) break;
      anterior = sobra;
      ajuste += sobra + 4;
    }
  };

  anterior.addEventListener('click', () => mostrar(atual - 1));
  proximo.addEventListener('click', () => mostrar(atual + 1));

  sincronizar();

  return {
    sincronizar,
    inicio: () => {
      atual = 0;
      sincronizar();
    },
  };
}
