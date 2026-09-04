/**
 * Destino 02 · Guest Intelligence.
 *
 * A lista é tratada com rigor de sistema de RSVP — e é exatamente daí que vem a
 * piada, porque metade dela nunca foi convidada.
 */

import { guestStatus, guestTiers } from './data.js';
import * as state from './state.js';

const $ = (selector, scope = document) => scope.querySelector(selector);

function buildGuest(guest) {
  const row = document.createElement('article');
  row.className = 'guest';
  if (guest.custom) row.dataset.custom = '';

  const name = document.createElement('h4');
  name.className = 'guest__name';
  name.textContent = guest.name;

  const role = document.createElement('p');
  role.className = 'guest__role';
  role.textContent = guest.role;

  const status = document.createElement('span');
  status.className = 'status';
  status.dataset.status = guest.status;
  status.textContent = guestStatus[guest.status] ?? guest.status;

  row.append(name, role, status);
  return row;
}

function buildTier(tier, pessoas) {
  const bloco = document.createElement('section');
  bloco.className = 'tier';
  bloco.dataset.tier = tier.id;

  const head = document.createElement('div');
  head.className = 'tier__head';

  const label = document.createElement('h3');
  label.className = 'tier__label';
  label.textContent = tier.label;

  const count = document.createElement('p');
  count.className = 'tier__count tabular';
  count.textContent = `${pessoas.length}`;

  const note = document.createElement('p');
  note.className = 'tier__note';
  note.textContent = tier.note;

  head.append(label, count, note);

  const lista = document.createElement('div');
  lista.className = 'tier__list';
  lista.append(...pessoas.map(buildGuest));

  bloco.append(head, lista);
  return bloco;
}

export function renderGuests() {
  const host = $('[data-roster]');
  const todos = state.allGuests();

  host.replaceChildren(
    ...guestTiers
      .map((tier) => [tier, todos.filter((g) => g.tier === tier.id)])
      // Camada vazia não vira bloco: ninguém precisa ver um título sem lista.
      .filter(([, pessoas]) => pessoas.length > 0)
      .map(([tier, pessoas]) => buildTier(tier, pessoas)),
  );

  const proprios = state.get().roster.length;
  $('[data-roster-count]').textContent = `${todos.length} ${todos.length === 1 ? 'nome' : 'nomes'}`;
  $('[data-roster-custom]').textContent =
    `${proprios} ${proprios === 1 ? 'adicionado' : 'adicionados'}`;
}

export function mountGuestForm() {
  const dialog = $('[data-guest-modal]');
  const form = $('[data-guest-form]');
  const feedback = $('[data-guest-feedback]');
  const trigger = $('[data-guest-open]');
  const tier = $('[name="tier"]', form);

  tier.replaceChildren(
    ...guestTiers.map((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.label;
      return option;
    }),
  );

  trigger.addEventListener('click', () => {
    form.reset();
    tier.value = 'inner';
    dialog.showModal();
  });

  // `pattern` barra nome só com espaços; a mensagem padrão do navegador não explica isso.
  const name = $('[name="name"]', form);
  name.addEventListener('invalid', () => name.setCustomValidity('Escreva ao menos uma palavra.'));
  name.addEventListener('input', () => name.setCustomValidity(''));
  $('[data-guest-cancel]', form).addEventListener('click', () => dialog.close());

  // Esc tratado aqui para o comportamento ser determinístico, e não do agente do usuário.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    trigger.focus();
    if (dialog.returnValue !== 'create') return;

    const data = new FormData(form);
    const guest = state.addGuest({
      name: data.get('name').trim(),
      tier: data.get('tier'),
      role: data.get('role').trim() || 'Convidado',
    });

    feedback.textContent = `${guest.name} entrou na lista.`;
    dialog.returnValue = '';
  });
}
