/**
 * Observador único de entrada em viewport.
 *
 * Desde a virada para navegação por views, a rolagem não dirige mais narrativa
 * alguma: ela existe só dentro de um destino, quando o conteúdo pede. O que
 * sobrou daqui é o reveal — e continua sendo o único lugar que observa viewport.
 */

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const prefersReducedMotion = () => reducedMotionQuery.matches;

/**
 * Reveal reversível: sair de vista desfaz a entrada. Como cada view esconde a
 * anterior, voltar a um destino reproduz a entrada dele.
 * `data-reveal-once` marca o que não pode desfazer — barras de dado zerando
 * parecem falha de renderização, não narrativa.
 */
export function observeReveals(root = document) {
  const targets = [...root.querySelectorAll('[data-reveal]')];

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealAll(root);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-revealed', entry.isIntersecting);
        if (entry.isIntersecting && entry.target.hasAttribute('data-reveal-once')) {
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );

  targets.forEach((el) => observer.observe(el));
}

/** Rede de segurança: nenhuma falha pode deixar conteúdo preso em opacity 0. */
export function revealAll(root = document) {
  root.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));
}
