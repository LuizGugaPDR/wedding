/**
 * Control Center: página editorial de dados, e o índice de destinos do hub.
 * Todos os números saem de state.js ou data.js — nada é escrito à mão.
 */

import {
  attractions,
  compatibilityBands,
  escapeRiskBands,
  guests,
  milestones,
  operations,
  universe,
  wedding,
} from './data.js';
import * as state from './state.js';
import { daysUntil } from './countdown.js';

const $ = (selector, scope = document) => scope.querySelector(selector);

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

const asDots = (iso) => dateFormat.format(new Date(iso)).replaceAll('/', '.');

/** `toISOString` converteria para UTC e o deadline às 23:59 viraria o dia seguinte. */
const asMachineDate = (iso) => {
  const parts = Object.fromEntries(
    dateFormat.formatToParts(new Date(iso)).map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const pad = (value) => String(Math.round(value)).padStart(2, '0');

const bandFor = (value) => compatibilityBands.find((band) => value >= band.min)?.label ?? '';
const escapeRiskFor = (value) => escapeRiskBands.find((band) => value >= band.min)?.label ?? '';

/* ---- Control Center --------------------------------------------------------- */

const rendered = { organized: null, compatibility: null, band: null, title: null };

/** Leituras derivadas do estado, seguidas das fixas de `data.js`. */
function readouts() {
  const counts = state.selectors.counts();
  const secrets = state.selectors.secrets();
  const confirmados = attractions.filter((a) =>
    ['negociacao-avancada', 'confirmado-delirio'].includes(a.status),
  ).length;

  return [
    { label: 'Convidados na lista', value: `${guests.length} / ${wedding.guestCount}` },
    {
      label: 'Decisões aprovadas',
      value: String(counts.unanimous).padStart(2, '0'),
      route: 'decisions',
    },
    {
      label: 'Decisões em aberto',
      value: String(counts.pending + counts.analysis).padStart(2, '0'),
      route: 'decisions',
    },
    { label: 'Atrações confirmadas', value: `${confirmados} / ${attractions.length}` },
    { label: 'Segredos encontrados', value: `${secrets.found} / ${secrets.total}`, tone: 'discovery' },
    { label: 'Estabilidade do casal', value: `${state.selectors.compatibility()}%` },
    { label: 'Risco de fuga da noiva', value: escapeRiskFor(state.selectors.compatibility()) },
    ...operations.map((op) => ({ label: op.label, value: op.value, tone: op.tone })),
  ];
}

/** Métrica que abre outro destino vira link: é o que faz o conjunto parecer sistema. */
export function mountReadouts() {
  const host = $('[data-readouts]');

  host.replaceChildren(
    ...readouts().map((readout) => {
      const cell = document.createElement(readout.route ? 'a' : 'div');
      cell.className = 'readout';
      if (readout.tone) cell.dataset.tone = readout.tone;
      if (readout.route) cell.href = `#${readout.route}`;

      const value = document.createElement('p');
      value.className = 'readout__value tabular';
      value.textContent = readout.value;

      const label = document.createElement('p');
      label.className = 'readout__label';
      label.append(readout.label);

      if (readout.route) {
        const go = document.createElement('span');
        go.className = 'readout__go';
        go.textContent = '\u2192';
        go.setAttribute('aria-hidden', 'true');
        label.append(go);
      }

      cell.append(value, label);
      return cell;
    }),
  );
}

/** Índice dos oito destinos. Sem cards: lista tipográfica. */
export function mountUniverse() {
  const host = $('[data-universe]');

  host.replaceChildren(
    ...universe.map((destino) => {
      const aberto = Boolean(destino.route);
      // Bloqueado não é botão: aparece no índice, mas não oferece clique nenhum.
      const row = document.createElement(aberto ? 'a' : 'div');
      row.className = 'universe__row';
      row.dataset.ready = String(aberto);

      if (aberto) row.href = `#${destino.route}`;

      const index = document.createElement('span');
      index.className = 'universe__index tabular';
      index.textContent = destino.index;

      const label = document.createElement('span');
      label.className = 'universe__label';
      label.textContent = destino.label;

      const status = document.createElement('span');
      status.className = 'universe__status';
      status.textContent = aberto ? 'Aberto' : 'Aguardando liberação';

      const arrow = document.createElement('span');
      arrow.className = 'universe__arrow';
      arrow.textContent = '\u2192';
      arrow.setAttribute('aria-hidden', 'true');

      const note = document.createElement('span');
      note.className = 'universe__note';
      note.textContent = destino.note;

      row.append(index, label, status, arrow, note);
      return row;
    }),
  );
}

/** Os medidores saem do estado direto; a animação de subida é do CSS. */
export function updateOverview() {
  const organized = state.selectors.progress();
  const compatibility = state.selectors.compatibility();

  if (organized !== rendered.organized) {
    rendered.organized = organized;
    const gauge = $('[data-gauge="progress"]');
    gauge.textContent = `${organized}%`;
    gauge.closest('.readiness').style.setProperty('--meter-value', `${organized}%`);
  }

  if (compatibility !== rendered.compatibility) {
    rendered.compatibility = compatibility;
    $('[data-gauge="compatibility"]').textContent = `${compatibility}%`;
  }

  const band = bandFor(compatibility);
  if (band !== rendered.band) {
    rendered.band = band;
    $('[data-gauge-band]').textContent = band;
  }

  const counts = state.selectors.counts();
  const open = counts.pending + counts.analysis;
  const title = open === 1 ? '1 item ainda espera veredito.' : `${open} itens ainda esperam veredito.`;
  if (title !== rendered.title) {
    rendered.title = title;
    $('[data-overview-title]').textContent = title;
  }
}

/* ---- Cronograma ------------------------------------------------------------ */

function setBar(name, value) {
  const bar = $(`[data-bar="${name}"]`);
  bar.style.setProperty('--bar-value', `${value}%`);
  $('[data-bar-value]', bar).textContent = `${pad(value)}%`;
}

export function renderSchedule() {
  const start = new Date(wedding.projectStart).getTime();
  const end = new Date(wedding.date).getTime();
  const elapsed = Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));

  setBar('elapsed', elapsed);
  setBar('organized', state.selectors.progress());

  $('[data-schedule-days]').textContent =
    `${daysUntil(wedding.date)} dias até a cerimônia · ${daysUntil(wedding.deadline)} até o deadline`;
}

export function mountMilestones() {
  const host = $('[data-milestones]');

  host.replaceChildren(
    ...milestones.map((milestone) => {
      const item = document.createElement('li');

      const date = document.createElement('time');
      date.className = 'milestones__date tabular';
      date.dateTime = asMachineDate(milestone.date);
      date.textContent = asDots(milestone.date);

      const label = document.createElement('span');
      label.className = 'micro';
      label.textContent = milestone.label;

      item.append(date, label);
      return item;
    }),
  );
}
