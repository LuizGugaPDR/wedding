/**
 * Wheel como gesto de navegação, não como rolagem.
 *
 * A página não desloca: com uma cena aberta, o gesto para cima a recolhe de volta
 * ao HUB. O acumulador existe porque trackpad dispara dezenas de eventos minúsculos
 * por gesto — sem ele, um toque só dispararia várias transições.
 */

const LIMIAR = 90;
const PAUSA = 260;
const TRAVA = 720;

/**
 * @param {{ noRecolher: () => void, ativo: () => boolean }} opcoes
 */
export function mountGesture({ noRecolher, ativo }) {
  let acumulado = 0;
  let ultimo = 0;
  let travado = false;

  const disparar = () => {
    travado = true;
    acumulado = 0;
    noRecolher();
    setTimeout(() => { travado = false; }, TRAVA);
  };

  window.addEventListener(
    'wheel',
    (event) => {
      if (travado || !ativo()) return;
      // Modal aberto tem rolagem própria e não pode virar gesto de saída.
      if (event.target.closest?.('dialog')) return;

      const agora = event.timeStamp;
      if (agora - ultimo > PAUSA || Math.sign(event.deltaY) !== Math.sign(acumulado)) acumulado = 0;
      ultimo = agora;
      acumulado += event.deltaY;

      if (acumulado <= -LIMIAR) disparar();
    },
    { passive: true },
  );

  // Teclado faz o mesmo caminho: o gesto não pode ser a única saída.
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || travado || !ativo()) return;
    if (document.querySelector('dialog[open]')) return;
    disparar();
  });
}
