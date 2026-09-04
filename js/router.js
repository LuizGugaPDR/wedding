/**
 * Roteador de views. Frontend-only, sem dependência: o hash é o estado da navegação.
 *
 * Cada destino é uma `[data-view]` que ocupa o viewport inteiro. A rolagem nunca
 * troca de destino — ela existe apenas dentro de uma view, quando o conteúdo pede.
 *
 * Sem JS todas as views ficam visíveis e os `href="#id"` viram âncoras comuns:
 * a experiência degrada para uma página longa em vez de sumir.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** A duração da transição mora em tokens.css; aqui ela é apenas lida. */
function duration(token) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return 0;
  return raw.endsWith('ms') ? value : value * 1000;
}

/**
 * @param {object} options
 * @param {string} options.home Rota usada quando o hash está vazio ou é desconhecido.
 * @param {(name: string, view: Element) => void} [options.onChange]
 */
export function startRouter({ home, onChange } = {}) {
  const views = new Map(
    [...document.querySelectorAll('[data-view]')].map((view) => [view.dataset.view, view]),
  );
  if (!views.has(home)) return { go: () => {} };

  const outDuration = duration('--dur-view-out');
  let current = null;
  let requested = null;

  const resolve = (name) => (views.has(name) ? name : home);

  async function show(name, { focus }) {
    const next = views.get(name);
    if (next === current) return;
    requested = next;

    if (current && !reducedMotion.matches) {
      current.dataset.viewState = 'leaving';
      await wait(outDuration);
      // Outro destino foi pedido no meio da saída: esta troca perdeu a vez.
      if (requested !== next) return;
    }

    for (const view of views.values()) {
      if (view === next) continue;
      view.hidden = true;
      delete view.dataset.viewState;
    }

    current = next;
    next.hidden = false;
    next.dataset.viewState = 'entering';
    // Dois quadros: o primeiro assenta o estado inicial, o segundo dispara a transição.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (current === next) next.dataset.viewState = 'active';
      });
    });

    window.scrollTo({ top: 0, behavior: 'auto' });
    if (focus) next.focus({ preventScroll: true });
    onChange?.(name, next);
  }

  const sync = (focus) => {
    const name = resolve(location.hash.replace(/^#/, ''));
    // Hash desconhecido não pode ficar na barra apontando para lugar nenhum.
    if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
    show(name, { focus });
  };

  window.addEventListener('hashchange', () => sync(true));
  sync(false);

  return {
    go(name) {
      const target = `#${resolve(name)}`;
      if (location.hash === target) return;
      location.hash = target;
    },
  };
}
