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
import { mountDeck } from './deck.js';
import { mountGuestForm, mountShowdown, renderGuests } from './guests.js';
import { mountGesture } from './scenes.js';
import { magnetize, trackPointer, trailHearts } from './interactions.js';
import { mountLock } from './lock.js';
import { mountPuzzle } from './puzzle.js';
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
 * O CTA deixou de rolar até o índice — ele já está na mesma tela. Agora abre o
 * único destino liberado, que é o que a Home tem a oferecer.
 */
function bindExplore(rota) {
  $('[data-explore]').addEventListener('click', () => rota.go('control-center'));
}

/**
 * Rastro do ponteiro em toda a aplicação. São duas camadas porque o cadeado é um
 * `<dialog>` modal: enquanto ele está aberto, nada do documento aparece por cima.
 */
function bindTrail() {
  const naPorta = $('[data-lock-trail]');
  const noOS = $('[data-trail]');
  trailHearts(document, () => (document.body.hasAttribute('data-locked') ? naPorta : noOS));
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
  bindReset();
  mountMilestones();
  mountUniverse();
  mountBoard();
  mountIdeaForm();
  mountGuestForm();
  mountShowdown();
  const puzzle = mountPuzzle();

  const viewLabel = $('[data-chrome-view]');
  const decks = {
    'control-center': mountDeck($('[data-deck="control-center"]'), {
      rotulo: 'Etapas do Control Center',
      linha: '.readout, .timeline__item',
    }),
    decisions: mountDeck($('[data-decisions]'), { rotulo: 'Categorias de decisão', linha: '.decision' }),
  };

  // As etapas são medidas: mudou a altura da janela, muda quanta coisa cabe.
  let remedir = 0;
  window.addEventListener('resize', () => {
    clearTimeout(remedir);
    remedir = setTimeout(() => decks[document.body.dataset.activeView]?.sincronizar(), 180);
  });

  // Trancado, o chrome não existe e os blocos ainda não foram revelados: o que o
  // deck mediu no boot não vale para a tela que ela vai realmente ver.
  new MutationObserver(() => decks[document.body.dataset.activeView]?.sincronizar()).observe(
    document.body,
    { attributeFilter: ['data-locked'] },
  );

  const rota = startRouter({
    home: 'home',
    onChange(name, view) {
      // A Operação recomeça do zero a cada entrada: sair é desistir da rodada.
      if (document.body.dataset.activeView === 'puzzle' && name !== 'puzzle') state.clearEvidence();
      document.body.dataset.activeView = name;
      viewLabel.textContent = view.dataset.viewLabel;
      decks[name]?.inicio();
    },
  });

  bindExplore(rota);
  // Com uma cena aberta, o gesto para cima a recolhe de volta ao HUB.
  mountGesture({
    ativo: () => document.body.dataset.activeView !== 'home' && !document.body.hasAttribute('data-locked'),
    noRecolher: () => rota.go('home'),
  });

  const render = () => {
    renderTelemetry();
    updateOverview();
    renderSchedule();
    renderDecisions();
    renderGuests();
    mountReadouts();
    // As etapas são os próprios blocos renderizados: mudou a lista, muda o deck.
    decks.decisions.sincronizar();
    puzzle.sincronizar();
  };

  state.subscribe(render);
  render();

  observeReveals();
  trackPointer();
  magnetize();
  bindTrail();

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

