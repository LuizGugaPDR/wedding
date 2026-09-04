/**
 * Capítulos 03 (Conselho) e 04 (Decisões).
 * O motor de decisões é o único lugar da aplicação onde o casal escreve no estado.
 */

import { decisionCategories, people, priorities, VOTE } from './data.js';
import * as state from './state.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* Glifos tipográficos, nunca emoji: a cor precisa vir dos tokens. */
const VOTE_MARK = {
  [VOTE.APPROVED]: '✓',
  [VOTE.VETOED]: '×',
  [VOTE.UNKNOWN]: '?',
};

const VOTE_LABEL = {
  [VOTE.APPROVED]: 'aprovado',
  [VOTE.VETOED]: 'vetado',
  [VOTE.UNKNOWN]: 'sem voto',
};

const STATUS_LABEL = {
  [state.DECISION_STATUS.UNANIMOUS]: 'Aprovação unânime',
  [state.DECISION_STATUS.VETO]: 'Veto unânime',
  [state.DECISION_STATUS.NEGOTIATION]: 'Negociação necessária',
  [state.DECISION_STATUS.ANALYSIS]: 'Em análise',
  [state.DECISION_STATUS.PENDING]: 'Pendente',
};

/* ---- 03 · Conselho -------------------------------------------------------- */

export function mountBoard() {
  const host = $('[data-board]');

  host.replaceChildren(
    ...people.map((person) => {
      const card = document.createElement('article');
      card.className = 'officer';

      const title = document.createElement('p');
      title.className = 'officer__title';
      title.textContent = person.title;

      const name = document.createElement('h3');
      name.className = 'officer__name';
      name.textContent = person.name;

      const charter = document.createElement('p');
      charter.className = 'officer__charter';
      charter.textContent = person.charter;

      const duties = document.createElement('ul');
      duties.className = 'officer__duties';
      duties.append(
        ...person.duties.map((duty) => {
          const item = document.createElement('li');
          item.textContent = duty;
          return item;
        }),
      );

      card.append(title, name, charter, duties);
      return card;
    }),
  );
}

/* ---- 04 · Decisões -------------------------------------------------------- */

const statusAnterior = new Map();
let idsRenderizados = '';

function buildRow(decision) {
  const row = document.createElement('article');
  row.className = 'decision';
  row.dataset.decision = decision.id;

  const head = document.createElement('div');
  head.className = 'decision__head';

  const title = document.createElement('h4');
  title.className = 'decision__title';
  title.textContent = decision.title;

  const badge = document.createElement('span');
  badge.className = 'status';
  badge.dataset.role = 'status';

  head.append(title, badge);

  const note = document.createElement('p');
  note.className = 'decision__note';
  note.textContent = decision.note ?? '';

  const votes = document.createElement('div');
  votes.className = 'votes';

  for (const person of people) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vote';
    button.dataset.person = person.key;

    const label = document.createElement('span');
    label.textContent = person.short;

    const mark = document.createElement('span');
    mark.className = 'vote__mark';
    mark.dataset.role = 'mark';

    button.append(label, mark);
    button.addEventListener('click', () => state.cycleVote(decision.id, person.key));
    votes.append(button);
  }

  row.append(head, note, votes);
  return row;
}

function buildList() {
  const host = $('[data-decisions]');
  const catalog = state.allDecisions();

  const grupos = Object.entries(decisionCategories)
    .map(([id, label]) => ({ id, label, itens: catalog.filter((d) => d.category === id) }))
    .filter((grupo) => grupo.itens.length > 0);

  host.replaceChildren(
    ...grupos.map((grupo) => {
      const section = document.createElement('section');
      section.className = 'decision-group';

      const heading = document.createElement('h3');
      heading.className = 'decision-group__title';
      heading.textContent = grupo.label;

      const count = document.createElement('span');
      count.className = 'decision-group__count tabular';
      count.textContent = String(grupo.itens.length).padStart(2, '0');
      heading.append(count);

      section.append(heading, ...grupo.itens.map(buildRow));
      return section;
    }),
  );
}

export function renderDecisions() {
  const catalog = state.allDecisions();
  const assinatura = catalog.map((d) => d.id).join('|');

  // Só reconstrói quando o conjunto muda; um voto apenas sincroniza as linhas.
  if (assinatura !== idsRenderizados) {
    idsRenderizados = assinatura;
    buildList();
  }

  const votes = state.get().votes;

  for (const decision of catalog) {
    const row = $(`[data-decision="${decision.id}"]`);
    if (!row) continue;

    const vote = votes[decision.id];
    const status = state.statusOf(vote);

    const badge = $('[data-role="status"]', row);
    badge.dataset.status = status;
    badge.textContent = STATUS_LABEL[status];

    for (const button of $$('.vote', row)) {
      const key = button.dataset.person;
      const value = vote?.[key] ?? VOTE.UNKNOWN;
      const person = people.find((p) => p.key === key);
      button.dataset.vote = value;
      button.setAttribute(
        'aria-label',
        `${person.name}: ${VOTE_LABEL[value]} em "${decision.title}". Clique para alterar.`,
      );
      $('[data-role="mark"]', button).textContent = VOTE_MARK[value];
    }

    // Feedback só quando o veredito muda de fato, não a cada clique.
    const anterior = statusAnterior.get(decision.id);
    if (anterior && anterior !== status) {
      row.classList.remove('is-changed');
      void row.offsetWidth;
      row.classList.add('is-changed');
    }
    statusAnterior.set(decision.id, status);
  }

  const counts = state.selectors.counts();
  $('[data-decisions-count]').textContent = `${counts.total} itens`;
  $('[data-decisions-open]').textContent = `${counts.pending + counts.analysis} em aberto`;
}

/* ---- Nova ideia ----------------------------------------------------------- */

function fillOptions(select, itens) {
  select.replaceChildren(
    ...itens.map(({ value, label }) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      return option;
    }),
  );
}

export function mountIdeaForm() {
  const dialog = $('[data-idea-modal]');
  const form = $('[data-idea-form]');
  const feedback = $('[data-idea-feedback]');
  const trigger = $('[data-idea-open]');

  fillOptions(
    $('[name="category"]', form),
    Object.entries(decisionCategories).map(([value, label]) => ({ value, label })),
  );
  fillOptions(
    $('[name="priority"]', form),
    priorities.map((p) => ({ value: p.id, label: p.label })),
  );
  $('[name="priority"]', form).value = 'media';

  $('[data-idea-proposer]', form).replaceChildren(
    ...people.map((person, index) => {
      const label = document.createElement('label');
      label.className = 'choice__option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'proposer';
      input.value = person.key;
      input.defaultChecked = index === 0;

      const text = document.createElement('span');
      text.textContent = person.name;

      label.append(input, text);
      return label;
    }),
  );

  $('[data-idea-open]').addEventListener('click', () => {
    form.reset();
    $('[name="priority"]', form).value = 'media';
    dialog.showModal();
  });

  // `pattern` barra título só com espaços; a mensagem padrão do navegador não explica isso.
  const title = $('[name="title"]', form);
  title.addEventListener('invalid', () => title.setCustomValidity('Escreva ao menos uma palavra.'));
  title.addEventListener('input', () => title.setCustomValidity(''));
  $('[data-idea-cancel]', form).addEventListener('click', () => dialog.close());

  // `dialog` entrega foco preso e retorno de foco ao gatilho. O Esc é tratado aqui
  // para o comportamento ser determinístico e testável, não depender do agente do usuário.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    trigger.focus();

    if (dialog.returnValue !== 'create') return;

    const data = new FormData(form);
    const idea = state.addIdea({
      title: data.get('title').trim(),
      category: data.get('category'),
      priority: data.get('priority'),
      note: data.get('note').trim(),
      proposer: data.get('proposer'),
    });

    feedback.textContent = `"${idea.title}" entrou em análise.`;
    dialog.returnValue = '';
  });
}
