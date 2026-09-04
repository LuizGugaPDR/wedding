/**
 * Bootstrap do Wedding OS.
 * A Home é o hub; cada experiência é um destino; o cadeado é a porta.
 */

import { wedding } from './data.js';
import * as state from './state.js';
import { daysUntil, mountCountdown } from './countdown.js';
import {
  mountMilestones,
  mountReadouts,
  mountUniverse,
  renderSchedule,
  updateOverview,
} from './dashboard.js';
import { mountBoard, mountIdeaForm, renderDecisions } from './decisions.js';
import { magnetize, trackPointer } from './interactions.js';
import { mountLock } from './lock.js';
import { startRouter } from './router.js';
import { observeReveals, revealAll } from './scroll.js';

const $ = (selector, scope = document) => scope.querySelector(selector);

const dateParts = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

/* ---- Home ----------------------------------------------------------------- */

function renderEntry(returning) {
  $('[data-entry-groom]').textContent = wedding.groom;
  $('[data-entry-bride]').textContent = wedding.bride;
  $('[data-entry-tagline]').textContent = wedding.tagline.join(' ');
  $('[data-entry-venue]').textContent = wedding.venue;
  $('[data-entry-guests]').textContent = wedding.guestCount;
  $('[data-entry-date]').textContent = dateParts.format(new Date(wedding.date)).replaceAll('/', ' . ');
  $('[data-entry-status]').textContent = returning ? 'Sessão restaurada' : 'Sessão iniciada';
  $('[data-deadline-days]').textContent = `· faltam ${daysUntil(wedding.deadline)} dias`;

  mountCountdown($('[data-countdown]'), wedding.date);
}

/**
 * O CTA leva ao índice de destinos dentro da própria Home. É o único movimento
 * de rolagem da aplicação — e por isso é botão, não âncora: `#hub` é rota.
 */
function bindExplore() {
  const hub = $('#hub');
  $('[data-explore]').addEventListener('click', () => hub.scrollIntoView({ block: 'start' }));
}

function announceLocked(destino) {
  $('[data-hub-alert]').textContent =
    `${destino.label} · aguardando liberação. Control Center é o único destino aberto.`;
}

/* ---- Chrome ---------------------------------------------------------------- */

function renderTelemetry() {
  const progress = state.selectors.progress();
  const secrets = state.selectors.secrets();
  const counts = state.selectors.counts();
  const open = counts.pending + counts.analysis;

  const meter = $('[data-chrome-progress]');
  meter.style.setProperty('--meter-value', `${progress}%`);
  $('.meter__value', meter).textContent = `${progress}%`;
  $('[data-chrome]').style.setProperty('--os-progress', String(progress));

  $('[data-chrome-secrets]').textContent = `${secrets.found} / ${secrets.total} segredos`;
  $('[data-decisions-shortcut]').textContent = `${open} em aberto →`;
}

/* ---- Boot ---------------------------------------------------------------- */

function bindReset() {
  const feedback = $('[data-reset-feedback]');
  $('[data-reset]').addEventListener('click', () => {
    state.reset();
    feedback.textContent = `Estado restaurado de fábrica às ${new Date().toLocaleTimeString('pt-BR')}`;
  });
}

/** Permite ensaiar a entrada antes de entregar o notebook para ela. */
function bindLockAgain(lock) {
  $('[data-lock-again]').addEventListener('click', () => lock.engage(true));
}

function boot() {
  // A entrada é a primeira impressão: o navegador não pode restaurar a rolagem antiga sobre ela.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  state.hydrate();
  const returning = Boolean(state.get().prefs.visited);
  document.body.toggleAttribute('data-returning', returning);

  renderEntry(returning);
  bindExplore();
  bindReset();
  mountMilestones();
  mountUniverse({ onLocked: announceLocked });
  mountBoard();
  mountIdeaForm();

  const viewLabel = $('[data-chrome-view]');
  startRouter({
    home: 'home',
    onChange(name, view) {
      document.body.dataset.activeView = name;
      viewLabel.textContent = view.dataset.viewLabel;
    },
  });

  const render = () => {
    renderTelemetry();
    updateOverview();
    renderSchedule();
    renderDecisions();
    mountReadouts();
  };

  state.subscribe(render);
  render();

  observeReveals();
  trackPointer();
  magnetize();

  const lock = mountLock({ onUnlock: () => state.setPref('visited', true) });
  bindLockAgain(lock);
  // O cadeado é a primeira coisa que ela vê — em toda visita, não só na primeira.
  lock.engage(true);

  document.body.dataset.booted = 'true';
}

try {
  boot();
} catch (error) {
  // Sem isso, qualquer exceção deixaria a página presa em opacity 0 — ou atrás do cadeado.
  revealAll();
  const lock = document.querySelector('[data-lock]');
  if (lock.open) lock.close();
  document.querySelector('[data-chrome]').hidden = false;
  document.body.removeAttribute('data-locked');
  console.error('Wedding OS falhou no boot.', error);
}

