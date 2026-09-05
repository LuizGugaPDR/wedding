/**
 * Operação 13.03 — caça-palavras.
 *
 * O grid é determinístico: as oito evidências têm coordenadas fixas em `data.js` e
 * o preenchimento sai de um gerador com semente. A validação compara o caminho
 * selecionado com as coordenadas da palavra, nunca com as letras — assim uma
 * sequência que "por acaso" soletre GALO em outro lugar não conta.
 */

import { evidence, evidenceBoard } from './data.js';
import * as state from './state.js';

const $ = (sel, scope = document) => scope.querySelector(sel);

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** mulberry32: pequeno, sem dependência e estável entre navegadores. */
function gerador(semente) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const chave = (row, col) => `${row},${col}`;

/** Coordenadas de cada letra, na ordem em que a palavra foi plantada. */
function caminhoDe(item) {
  return Array.from({ length: item.word.length }, (_, i) => ({
    row: item.row + item.dr * i,
    col: item.col + item.dc * i,
  }));
}

function montarGrid() {
  const { size, seed } = evidenceBoard;
  const letras = Array.from({ length: size }, () => Array(size).fill(''));
  const dono = new Map();

  for (const item of evidence) {
    caminhoDe(item).forEach(({ row, col }, i) => {
      letras[row][col] = item.word[i];
      dono.set(chave(row, col), item.id);
    });
  }

  const sorteio = gerador(seed);
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (letras[row][col]) continue;
      letras[row][col] = ALFABETO[Math.floor(sorteio() * ALFABETO.length)];
    }
  }

  return { letras, dono, size };
}

/**
 * @param {{ onFound?: (item: object) => void }} [opcoes]
 * @returns {{ sincronizar: () => void }}
 */
export function mountPuzzle({ onFound } = {}) {
  const raiz = $('[data-puzzle]');
  if (!raiz) return { sincronizar: () => {} };

  const gradeEl = $('[data-puzzle-grid]', raiz);
  const listaEl = $('[data-puzzle-list]', raiz);
  const contadorEl = $('[data-puzzle-count]', raiz);
  const avisoEl = $('[data-puzzle-feedback]', raiz);
  const fimEl = $('[data-puzzle-done]', raiz);

  const { letras, size } = montarGrid();
  const celulas = new Map();
  const porId = new Map(evidence.map((item) => [item.id, item]));

  // Índice de busca: extremos do caminho apontam para a palavra, nos dois sentidos.
  const extremos = new Map();
  for (const item of evidence) {
    const caminho = caminhoDe(item);
    const a = caminho[0];
    const z = caminho.at(-1);
    extremos.set(`${chave(a.row, a.col)}|${chave(z.row, z.col)}`, item.id);
    extremos.set(`${chave(z.row, z.col)}|${chave(a.row, a.col)}`, item.id);
  }

  gradeEl.style.setProperty('--puzzle-size', String(size));
  gradeEl.setAttribute('role', 'grid');
  gradeEl.setAttribute('aria-rowcount', String(size));
  gradeEl.setAttribute('aria-colcount', String(size));

  for (let row = 0; row < size; row += 1) {
    const linha = document.createElement('div');
    linha.className = 'puzzle__row';
    linha.setAttribute('role', 'row');
    for (let col = 0; col < size; col += 1) {
      const cel = document.createElement('button');
      cel.type = 'button';
      cel.className = 'puzzle__cell';
      cel.setAttribute('role', 'gridcell');
      cel.dataset.row = String(row);
      cel.dataset.col = String(col);
      cel.tabIndex = row === 0 && col === 0 ? 0 : -1;
      cel.textContent = letras[row][col];
      cel.setAttribute('aria-label', `${letras[row][col]}, linha ${row + 1}, coluna ${col + 1}`);
      celulas.set(chave(row, col), cel);
      linha.append(cel);
    }
    gradeEl.append(linha);
  }

  const itens = new Map();
  listaEl.replaceChildren(
    ...evidence.map((item) => {
      const li = document.createElement('li');
      li.className = 'puzzle__word';
      li.dataset.evidence = item.id;
      li.textContent = item.display;
      itens.set(item.id, li);
      return li;
    }),
  );

  let ancora = null;
  let selecao = [];
  let arrastando = false;

  const limparSelecao = () => {
    for (const cel of celulas.values()) cel.classList.remove('is-picking');
    selecao = [];
  };

  const pintar = (caminho) => {
    for (const cel of celulas.values()) cel.classList.remove('is-picking');
    for (const { row, col } of caminho) celulas.get(chave(row, col))?.classList.add('is-picking');
    selecao = caminho;
  };

  /** Só linha, coluna ou diagonal exata: fora disso o traço não muda. */
  const tracar = (row, col) => {
    if (!ancora) return;
    const dr = row - ancora.row;
    const dc = col - ancora.col;
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return;
    const passos = Math.max(Math.abs(dr), Math.abs(dc));
    const pr = Math.sign(dr);
    const pc = Math.sign(dc);
    pintar(
      Array.from({ length: passos + 1 }, (_, i) => ({
        row: ancora.row + pr * i,
        col: ancora.col + pc * i,
      })),
    );
  };

  const anunciar = (texto, tom = 'ok') => {
    avisoEl.dataset.tone = tom;
    avisoEl.textContent = texto;
  };

  const marcarAchada = (item) => {
    for (const { row, col } of caminhoDe(item)) {
      celulas.get(chave(row, col))?.classList.add('is-found');
    }
    itens.get(item.id)?.setAttribute('data-found', '');
  };

  let saga = 0;
  const celebrar = (item) => {
    anunciar(item.message);
    clearTimeout(saga);
    if (!item.saga) return;
    // Duas linhas em sequência: pausa curta, sem travar o jogo.
    item.saga.forEach((linha, i) => {
      saga = setTimeout(() => anunciar(linha, 'saga'), 900 * (i + 1));
    });
  };

  const encerrar = () => {
    const achadas = state.get().evidence;
    contadorEl.textContent = `${achadas.length} / ${evidence.length}`;
    const completo = achadas.length === evidence.length;
    fimEl.hidden = !completo;
    raiz.toggleAttribute('data-complete', completo);
  };

  const conferir = () => {
    if (selecao.length < 2) return limparSelecao();
    const a = selecao[0];
    const z = selecao.at(-1);
    const id = extremos.get(`${chave(a.row, a.col)}|${chave(z.row, z.col)}`);
    const item = id && porId.get(id);

    if (!item || selecao.length !== item.word.length) {
      const errado = selecao.map(({ row, col }) => celulas.get(chave(row, col)));
      limparSelecao();
      for (const cel of errado) {
        if (!cel) continue;
        cel.classList.add('is-wrong');
        setTimeout(() => cel.classList.remove('is-wrong'), 420);
      }
      return;
    }

    limparSelecao();
    marcarAchada(item);
    // Repetida não conta duas vezes: o estado é a fonte da verdade.
    if (!state.findEvidence(item.id)) return;
    celebrar(item);
    onFound?.(item);
  };

  const celulaEm = (x, y) => document.elementFromPoint(x, y)?.closest('[data-row]');

  gradeEl.addEventListener('pointerdown', (event) => {
    const cel = event.target.closest('[data-row]');
    if (!cel) return;
    event.preventDefault();
    arrastando = true;
    gradeEl.setPointerCapture(event.pointerId);
    ancora = { row: Number(cel.dataset.row), col: Number(cel.dataset.col) };
    pintar([ancora]);
  });

  gradeEl.addEventListener('pointermove', (event) => {
    if (!arrastando) return;
    const cel = celulaEm(event.clientX, event.clientY);
    if (cel) tracar(Number(cel.dataset.row), Number(cel.dataset.col));
  });

  const soltar = () => {
    if (!arrastando) return;
    arrastando = false;
    ancora = null;
    conferir();
  };

  gradeEl.addEventListener('pointerup', soltar);
  gradeEl.addEventListener('pointercancel', soltar);

  // Teclado: setas movem o foco, Enter fixa a âncora e Enter de novo fecha o traço.
  gradeEl.addEventListener('keydown', (event) => {
    const cel = event.target.closest('[data-row]');
    if (!cel) return;
    const row = Number(cel.dataset.row);
    const col = Number(cel.dataset.col);
    const passo = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[
      event.key
    ];

    if (passo) {
      event.preventDefault();
      const alvo = celulas.get(chave(row + passo[0], col + passo[1]));
      if (!alvo) return;
      cel.tabIndex = -1;
      alvo.tabIndex = 0;
      alvo.focus();
      if (ancora) tracar(Number(alvo.dataset.row), Number(alvo.dataset.col));
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (!ancora) {
      ancora = { row, col };
      pintar([ancora]);
      anunciar('Início marcado. Use as setas e confirme na última letra.', 'dica');
      return;
    }
    ancora = null;
    conferir();
  });

  gradeEl.addEventListener('focusout', (event) => {
    if (!ancora || gradeEl.contains(event.relatedTarget)) return;
    ancora = null;
    limparSelecao();
  });

  const sincronizar = () => {
    // Limpa antes de remarcar: sem isso o RESET zera o contador e deixa o rastro.
    for (const cel of celulas.values()) cel.classList.remove('is-found');
    for (const li of itens.values()) li.removeAttribute('data-found');
    for (const id of state.get().evidence) {
      const item = porId.get(id);
      if (item) marcarAchada(item);
    }
    encerrar();
  };

  sincronizar();
  if (reducedMotion.matches) raiz.setAttribute('data-still', '');

  return { sincronizar };
}
