/**
 * Destino 02 · Atrações principais.
 *
 * Cinco nomes tratados com rigor de cartaz de festival — e é daí que vem a piada,
 * porque nenhum deles foi convidado.
 */

import { guestStatus, guestTiers, showdown } from './data.js';
import * as state from './state.js';

const $ = (selector, scope = document) => scope.querySelector(selector);

/** Cartaz do main event. Conteúdo vem de `data.js`, como todo o resto. */
export function mountShowdown() {
  const dialog = $('[data-showdown]');
  const abrir = $('[data-showdown-open]');
  if (!dialog || !abrir) return;

  const foto = $('[data-showdown-photo]', dialog);
  const imagem = $('[data-showdown-image]', dialog);

  $('[data-showdown-eyebrow]').textContent = showdown.eyebrow;
  $('[data-showdown-challenger]').textContent = showdown.challenger;
  $('[data-showdown-versus]').textContent = showdown.versus;
  $('[data-showdown-opponent]').textContent = showdown.opponent;
  $('[data-showdown-cue]').textContent = showdown.cue;
  $('[data-showdown-note]').textContent = showdown.note;
  imagem.alt = showdown.alt;

  const mostrarFoto = (visivel) => {
    // A imagem só é buscada no primeiro clique: o cartaz abre sem esperar por ela.
    if (visivel && !imagem.src) imagem.src = showdown.image;
    foto.hidden = !visivel;
    dialog.toggleAttribute('data-evidence', visivel);
    $(visivel ? '[data-showdown-hide]' : '[data-showdown-reveal]', dialog).focus();
  };

  abrir.addEventListener('click', () => {
    mostrarFoto(false);
    dialog.showModal();
  });
  $('[data-showdown-reveal]', dialog).addEventListener('click', () => mostrarFoto(true));
  $('[data-showdown-hide]', dialog).addEventListener('click', () => mostrarFoto(false));
  $('[data-showdown-close]').addEventListener('click', () => dialog.close());

  // Esc tratado aqui para o comportamento ser determinístico, como no resto do OS.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    // Com a evidência aberta, Esc recua para o cartaz em vez de fechar tudo.
    if (foto.hidden) dialog.close();
    else mostrarFoto(false);
  });
}

function buildGuest(guest, ordem) {
  const row = document.createElement('article');
  row.className = 'act';
  if (guest.custom) row.dataset.custom = '';

  const index = document.createElement('p');
  index.className = 'act__index tabular';
  index.textContent = String(ordem + 1).padStart(2, '0');

  const name = document.createElement('h3');
  name.className = 'act__name';
  name.textContent = guest.name;

  const role = document.createElement('p');
  role.className = 'act__role';
  role.textContent = guest.role;

  const status = document.createElement('span');
  status.className = 'status';
  status.dataset.status = guest.status;
  status.textContent = guestStatus[guest.status] ?? guest.status;

  row.append(index, name, role, status);
  return row;
}

export function renderGuests() {
  const host = $('[data-roster]');
  const todos = state.allGuests();

  host.replaceChildren(...todos.map(buildGuest));

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
  // Camada única não é escolha: o campo só aparece quando houver o que escolher.
  tier.closest('.field').hidden = guestTiers.length < 2;

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
