/**
 * Acesso privado ao Wedding OS.
 *
 * Não é autenticação: é a primeira microinteração da experiência. A interface
 * finge levar a sério uma pergunta que ninguém levou a sério na época.
 */

import { access } from './data.js';
import { rainHearts, trailHearts } from './interactions.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Ignora espaços nas pontas e caixa, mas mantém acento e pontuação. */
const normalize = (value) => value.trim().toLocaleLowerCase('pt-BR');

const DENIED_MS = 420;

export function mountLock({ onUnlock }) {
  const lock = document.querySelector('[data-lock]');
  const seal = document.querySelector('[data-lock-seal]');
  const form = document.querySelector('[data-lock-form]');
  const input = form.elements.phrase;
  const verdict = document.querySelector('[data-lock-verdict]');
  const reason = document.querySelector('[data-lock-reason]');
  const log = document.querySelector('[data-lock-log]');
  const chrome = document.querySelector('[data-chrome]');
  const reveal = document.querySelector('[data-lock-reveal]');

  let running = false;
  let retrato = null;

  document.querySelector('[data-lock-vow]').textContent = access.vow;
  mountDrift();
  mountDossier();
  mountReveal();
  trailHearts(lock, document.querySelector('[data-lock-trail]'));

  /** Palavras da lista derivando ao fundo. Decorativo: fica fora da árvore de acessibilidade. */
  function mountDrift() {
    document.querySelector('[data-lock-drift]').replaceChildren(
      ...access.drift.map((word) => {
        const item = document.createElement('span');
        item.className = 'lock__word';
        item.style.cssText = `--drift-top:${word.top}%;--drift-left:${word.left}%;--drift-size:${word.size}rem;--drift-shift:${word.shift}rem;--drift-duration:${word.duration}s;--drift-delay:${word.delay}s`;

        // A deriva lenta mora no pai e o impulso do hover no filho: dois `translate`
        // que se compõem, em vez de um só que saltaria ao trocar de duração.
        const boost = document.createElement('span');
        boost.className = 'lock__word-boost';
        boost.textContent = word.text;

        item.append(boost);
        return item;
      }),
    );
  }

  function mountDossier() {
    document.querySelector('[data-lock-dossier]').replaceChildren(
      ...access.dossier.map((entry) => {
        const row = document.createElement('div');

        const label = document.createElement('dt');
        label.textContent = entry.label;

        const value = document.createElement('dd');
        value.textContent = entry.value;

        row.append(label, value);
        return row;
      }),
    );
  }

  const setStage = (stage) => {
    lock.dataset.stage = stage;
  };

  /** A foto é o único ativo remoto do cadeado: sem ela a etapa simplesmente não existe. */
  function mountReveal() {
    document.querySelector('[data-lock-reveal-eyebrow]').textContent = access.reveal.eyebrow;
    document.querySelector('[data-lock-reveal-title]').textContent = access.reveal.title;
    document.querySelector('[data-lock-reveal-note]').textContent = access.reveal.note;
    reveal.style.setProperty('--reveal-fade', `${access.reveal.fade}ms`);

    const foto = document.querySelector('[data-lock-reveal-photo]');
    foto.addEventListener('load', () => {
      retrato = foto;
    });
    foto.alt = access.reveal.alt;
    foto.src = access.reveal.image;
  }

  /** Surge devagar, chove coração, e some junto com o cadeado, de uma vez. */
  async function revelar() {
    if (!retrato) return;
    reveal.hidden = false;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    setStage('reveal');

    const pararChuva = rainHearts(document.querySelector('[data-lock-rain]'));
    const espera = reduzido.matches
      ? access.reveal.hold
      : access.reveal.fade + access.reveal.hold;

    // Dez segundos é tempo de ler; quem já leu não precisa esperar o relógio.
    await Promise.race([wait(espera), pular()]);
    pararChuva();
  }

  /** Resolve no primeiro clique ou tecla, para a revelação nunca prender ninguém. */
  function pular() {
    return new Promise((resolve) => {
      const sair = () => {
        reveal.removeEventListener('pointerdown', sair);
        document.removeEventListener('keydown', sair);
        resolve();
      };
      reveal.addEventListener('pointerdown', sair);
      document.addEventListener('keydown', sair);
    });
  }

  function clearFeedback() {
    verdict.textContent = '';
    reason.textContent = '';
    log.textContent = '';
  }

  /** `showModal` já entrega foco preso e o resto do documento inerte. */
  function shield(locked) {
    if (locked && !lock.open) lock.showModal();
    if (!locked && lock.open) lock.close();
    chrome.hidden = locked;
    document.body.toggleAttribute('data-locked', locked);
  }

  async function grant() {
    running = true;
    clearFeedback();
    setStage('granted');

    for (const step of access.sequence) {
      log.textContent = step.text;
      await wait(step.hold);
    }

    lock.setAttribute('data-open', '');
    log.textContent = '';
    verdict.textContent = access.granted.verdict;
    reason.textContent = access.granted.reason;
    await wait(access.granted.hold);

    await revelar();

    shield(false);
    reveal.hidden = true;
    lock.removeAttribute('data-open');
    setStage('locked');
    clearFeedback();
    input.value = '';
    running = false;
    onUnlock();
  }

  function deny() {
    verdict.textContent = access.denied.verdict;
    reason.textContent = access.denied.reason;
    log.textContent = access.denied.retry;

    lock.setAttribute('data-denied', '');
    setTimeout(() => lock.removeAttribute('data-denied'), DENIED_MS);

    input.focus();
    input.select();
  }

  seal.addEventListener('click', () => {
    if (running) return;
    setStage('auth');
    input.focus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (running) return;
    if (normalize(input.value) === normalize(access.phrase)) grant();
    else deny();
  });

  // Esc nunca fecha o acesso: ele apenas recua da verificação para a porta fechada.
  // O tratamento fica no `keydown` porque o evento `cancel` do dialog depende de ativação
  // do usuário e não chega de forma confiável quando a modal abre sozinha no boot.
  lock.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (running || lock.dataset.stage !== 'auth') return;
    setStage('locked');
    clearFeedback();
    input.value = '';
    seal.focus();
  });

  lock.addEventListener('cancel', (event) => event.preventDefault());

  return {
    engage(locked, { focus = true } = {}) {
      if (running) return;
      setStage('locked');
      clearFeedback();
      reveal.hidden = true;
      input.value = '';
      shield(locked);
      if (locked && focus) seal.focus();
    },
  };
}
