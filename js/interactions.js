/**
 * Resposta ao ponteiro. Um único listener publica a posição normalizada em
 * `--pointer-x` / `--pointer-y` (-1 a 1) e cada camada decide o quanto se desloca.
 *
 * Movement follows intent: nada aqui anima sozinho, tudo responde ao usuário.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Deslocamento sutil de camadas dentro de `[data-pointer]`. */
export function trackPointer() {
  if (reducedMotion.matches || !finePointer.matches) return;

  for (const stage of document.querySelectorAll('[data-pointer]')) {
    for (const layer of stage.querySelectorAll('[data-pointer-layer]')) {
      layer.style.setProperty('--pointer-layer', layer.dataset.pointerLayer);
    }

    let frame = 0;
    let position = { x: 0, y: 0 };

    const apply = () => {
      frame = 0;
      stage.style.setProperty('--pointer-x', position.x.toFixed(3));
      stage.style.setProperty('--pointer-y', position.y.toFixed(3));
    };

    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      position = {
        x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
        y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
      };
      if (!frame) frame = requestAnimationFrame(apply);
    });

    stage.addEventListener('pointerleave', () => {
      position = { x: 0, y: 0 };
      if (!frame) frame = requestAnimationFrame(apply);
    });
  }
}

/** Atração magnética discreta: o alvo se inclina alguns pixels na direção do cursor. */
export function magnetize() {
  if (reducedMotion.matches || !finePointer.matches) return;

  for (const target of document.querySelectorAll('[data-magnetic]')) {
    const reset = () => {
      target.style.setProperty('--magnet-x', '0px');
      target.style.setProperty('--magnet-y', '0px');
    };

    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      target.style.setProperty('--magnet-x', `${clamp(dx * 0.18, -14, 14).toFixed(1)}px`);
      target.style.setProperty('--magnet-y', `${clamp(dy * 0.3, -10, 10).toFixed(1)}px`);
    });

    target.addEventListener('pointerleave', reset);
    target.addEventListener('blur', reset);
  }
}

const HEART = 'M12 20.7 3.9 12.6a5.1 5.1 0 1 1 7.2-7.2l.9.9.9-.9a5.1 5.1 0 1 1 7.2 7.2Z';
const PASSO = 52;
const TETO = 10;

/**
 * Rastro de corações atrás do ponteiro. Exceção deliberada à direção de arte, pedida
 * para a tela de acesso e restrita a ela: o coração some antes de virar decoração.
 *
 * @param {Element} escopo Área que escuta o ponteiro.
 * @param {Element} palco Camada onde os corações nascem.
 */
export function trailHearts(escopo, palco) {
  if (reducedMotion.matches || !finePointer.matches) return;

  let ultimo = null;
  let vivos = 0;

  escopo.addEventListener('pointermove', (event) => {
    const ponto = { x: event.clientX, y: event.clientY };

    // Um coração a cada trecho percorrido, não a cada evento: senão vira enxame.
    if (ultimo && Math.hypot(ponto.x - ultimo.x, ponto.y - ultimo.y) < PASSO) return;
    ultimo = ponto;
    if (vivos >= TETO) return;

    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heart.setAttribute('class', 'heart');
    heart.setAttribute('viewBox', '0 0 24 24');
    heart.style.left = `${ponto.x}px`;
    heart.style.top = `${ponto.y}px`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', HEART);
    heart.append(path);
    palco.append(heart);
    vivos += 1;

    const giro = (Math.random() * 2 - 1) * 28;
    const desvio = (Math.random() * 2 - 1) * 22;
    const subida = 26 + Math.random() * 26;

    const fim = () => {
      heart.remove();
      vivos -= 1;
    };

    heart.animate(
      [
        { opacity: 0, transform: `translate(-50%, -50%) rotate(${giro}deg) scale(0.3)` },
        { opacity: 0.9, transform: `translate(-50%, -60%) rotate(${giro}deg) scale(1)`, offset: 0.22 },
        {
          opacity: 0,
          transform: `translate(calc(-50% + ${desvio}px), calc(-50% - ${subida}px)) rotate(${giro}deg) scale(0.55)`,
        },
      ],
      { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    ).addEventListener('finish', fim);
  });
}

const CADENCIA = 230;

/** Ondas sucessivas: uma só rajada vira estouro de pipoca, três viram explosão. */
const ONDAS = [0, 230, 500];

/**
 * Explosão do desbloqueio: corações e cópias da foto saindo do centro da tela.
 * Acontece uma vez, dura poucos segundos e termina deixando a revelação sozinha.
 *
 * @param {Element} palco Camada onde as peças nascem.
 * @param {string} foto URL da imagem já carregada pela revelação.
 * @returns {() => void} Encerra a explosão e limpa o que sobrou.
 */
export function burstReveal(palco, foto) {
  if (reducedMotion.matches) return () => {};

  const vivos = new Set();
  const agendados = [];
  const estreito = window.innerWidth < 768;
  // Meia diagonal: garante que a peça mais distante saia da tela em qualquer proporção.
  const raio = Math.hypot(window.innerWidth, window.innerHeight) / 2;

  const lancar = (peca, escalaFinal) => {
    palco.append(peca);
    vivos.add(peca);

    const angulo = Math.random() * Math.PI * 2;
    const alcance = raio * (0.5 + Math.random() * 0.6);
    const x = Math.cos(angulo) * alcance;
    const y = Math.sin(angulo) * alcance;
    const giro = (Math.random() * 2 - 1) * 110;

    const voo = peca.animate(
      [
        { opacity: 0, transform: 'translate(-50%, -50%) scale(0.15) rotate(0deg)' },
        {
          opacity: 1,
          transform: `translate(calc(-50% + ${(x * 0.3).toFixed(1)}px), calc(-50% + ${(y * 0.3).toFixed(1)}px)) scale(1) rotate(${(giro * 0.3).toFixed(1)}deg)`,
          offset: 0.2,
        },
        {
          opacity: 0,
          transform: `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px)) scale(${escalaFinal}) rotate(${giro.toFixed(1)}deg)`,
        },
      ],
      { duration: 1500 + Math.random() * 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    );

    voo.addEventListener('finish', () => {
      peca.remove();
      vivos.delete(peca);
    });
  };

  const carta = () => {
    const img = document.createElement('img');
    img.className = 'lock__shard';
    img.src = foto;
    img.alt = '';
    img.style.width = `${(estreito ? 3.5 : 5) + Math.random() * (estreito ? 4 : 9)}rem`;
    lancar(img, 0.85);
  };

  const coracao = () => {
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heart.setAttribute('class', 'heart heart--burst');
    heart.setAttribute('viewBox', '0 0 24 24');
    heart.style.width = `${0.8 + Math.random() * 1.5}rem`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', HEART);
    heart.append(path);
    lancar(heart, 0.5);
  };

  ONDAS.forEach((atraso, onda) => {
    // A primeira onda é a maior: é ela que lê como explosão.
    const peso = onda === 0 ? 1 : 0.55;
    const cartas = Math.round((estreito ? 5 : 9) * peso);
    const coracoes = Math.round((estreito ? 14 : 24) * peso);

    const disparar = () => {
      for (let i = 0; i < cartas; i += 1) carta();
      for (let i = 0; i < coracoes; i += 1) coracao();
    };

    if (atraso === 0) disparar();
    else agendados.push(setTimeout(disparar, atraso));
  });

  return () => {
    for (const relogio of agendados) clearTimeout(relogio);
    for (const peca of vivos) peca.remove();
    vivos.clear();
  };
}

/**
 * Chuva de corações caindo pela tela. Vive só enquanto a revelação está no ar.
 *
 * @param {Element} palco Camada onde os corações caem.
 * @returns {() => void} Encerra a chuva e limpa o que sobrou.
 */
export function rainHearts(palco) {
  if (reducedMotion.matches) return () => {};

  const soltos = new Set();

  const soltar = () => {
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heart.setAttribute('class', 'heart heart--rain');
    heart.setAttribute('viewBox', '0 0 24 24');
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.width = `${0.5 + Math.random() * 0.55}rem`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', HEART);
    heart.append(path);
    palco.append(heart);
    soltos.add(heart);

    const deriva = (Math.random() * 2 - 1) * 60;
    const giro = (Math.random() * 2 - 1) * 90;

    const queda = heart.animate(
      [
        { opacity: 0, transform: 'translateY(-12vh) rotate(0deg)' },
        { opacity: 0.7, offset: 0.12 },
        { opacity: 0.7, offset: 0.85 },
        { opacity: 0, transform: `translate(${deriva}px, 108vh) rotate(${giro}deg)` },
      ],
      { duration: 4200 + Math.random() * 2600, easing: 'linear' },
    );

    queda.addEventListener('finish', () => {
      heart.remove();
      soltos.delete(heart);
    });
  };

  soltar();
  const relogio = setInterval(soltar, CADENCIA);

  return () => {
    clearInterval(relogio);
    for (const heart of soltos) heart.remove();
    soltos.clear();
  };
}
