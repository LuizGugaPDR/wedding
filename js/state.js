/**
 * Fonte única de verdade do Wedding OS.
 * Mutações passam obrigatoriamente por este módulo, que persiste e notifica assinantes.
 */

import { decisions, easterEggs, priorities, VOTE } from './data.js';
import * as storage from './storage.js';

export const DECISION_STATUS = Object.freeze({
  UNANIMOUS: 'unanimous',
  VETO: 'veto',
  NEGOTIATION: 'negotiation',
  ANALYSIS: 'analysis',
  PENDING: 'pending',
});

const listeners = new Set();
let state = null;

function factoryState() {
  const votes = {};
  for (const decision of decisions) votes[decision.id] = { ...decision.seed };
  return {
    schema: storage.SCHEMA,
    votes,
    ideas: [],
    secrets: [],
    // O acesso não mora aqui: o cadeado fecha a cada visita, de propósito.
    prefs: { visited: false },
  };
}

function isIdea(value) {
  return Boolean(value) && typeof value.id === 'string' && typeof value.title === 'string';
}

/**
 * Ignora ids desconhecidos para que decisões novas cheguem com seu seed em versões futuras,
 * mas preserva os votos das ideias criadas pelo casal.
 */
function mergePersisted(persisted) {
  const next = factoryState();
  if (!persisted) return next;

  if (Array.isArray(persisted.ideas)) next.ideas = persisted.ideas.filter(isIdea);

  if (persisted.votes) {
    const conhecidos = new Set([
      ...decisions.map((d) => d.id),
      ...next.ideas.map((idea) => idea.id),
    ]);
    for (const id of conhecidos) {
      const stored = persisted.votes[id];
      if (stored?.luiz && stored?.mel) next.votes[id] = { luiz: stored.luiz, mel: stored.mel };
    }
  }

  if (Array.isArray(persisted.secrets)) {
    const known = new Set(easterEggs.map((egg) => egg.id));
    next.secrets = persisted.secrets.filter((id) => known.has(id));
  }
  if (persisted.prefs) next.prefs = { ...next.prefs, ...persisted.prefs };
  return next;
}

function commit() {
  save();
  for (const listener of listeners) listener(state);
}

export function hydrate() {
  state = mergePersisted(storage.load());
  return state;
}

export function save() {
  return storage.save(get());
}

export function get() {
  return state ?? hydrate();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function reset() {
  storage.clear();
  state = factoryState();
  commit();
  return state;
}

export function setVote(decisionId, person, vote) {
  const current = get().votes[decisionId];
  if (!current || !(person in current)) return;
  if (!Object.values(VOTE).includes(vote)) return;
  state.votes[decisionId] = { ...current, [person]: vote };
  commit();
}

/** Alterna entre aprovado → vetado → indefinido, para um único controle por pessoa. */
export function cycleVote(decisionId, person) {
  const current = get().votes[decisionId]?.[person];
  const order = [VOTE.UNKNOWN, VOTE.APPROVED, VOTE.VETOED];
  const next = order[(order.indexOf(current) + 1) % order.length];
  setVote(decisionId, person, next);
}

export function addIdea({ title, category, priority, note, proposer }) {
  const weight = priorities.find((p) => p.id === priority)?.weight ?? 2;
  const idea = {
    id: `idea-${Date.now().toString(36)}`,
    title,
    category,
    priority,
    weight,
    note,
    proposer,
    createdAt: new Date().toISOString(),
  };

  const current = get();
  current.ideas.push(idea);
  // Quem propôs já aprovou: a ideia nasce em análise, esperando o outro voto.
  current.votes[idea.id] = {
    luiz: proposer === 'luiz' ? VOTE.APPROVED : VOTE.UNKNOWN,
    mel: proposer === 'mel' ? VOTE.APPROVED : VOTE.UNKNOWN,
  };
  commit();
  return idea;
}

/** Catálogo fixo mais as ideias do casal, todas no mesmo formato. */
export function allDecisions() {
  return [
    ...decisions,
    ...get().ideas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      category: idea.category,
      weight: idea.weight ?? 2,
      note: idea.note,
      custom: true,
    })),
  ];
}

export function discoverSecret(id) {
  const current = get();
  if (current.secrets.includes(id)) return false;
  current.secrets.push(id);
  commit();
  return true;
}

export function setPref(key, value) {
  const prefs = get().prefs;
  if (prefs[key] === value) return;
  state.prefs = { ...prefs, [key]: value };
  commit();
}

export function statusOf(vote) {
  const { luiz, mel } = vote ?? {};
  const decided = (v) => v && v !== VOTE.UNKNOWN;
  if (!decided(luiz) && !decided(mel)) return DECISION_STATUS.PENDING;
  if (!decided(luiz) || !decided(mel)) return DECISION_STATUS.ANALYSIS;
  if (luiz !== mel) return DECISION_STATUS.NEGOTIATION;
  return luiz === VOTE.VETOED ? DECISION_STATUS.VETO : DECISION_STATUS.UNANIMOUS;
}

export const selectors = {
  /** Percentual de decisões com os dois votos preenchidos. */
  progress() {
    const votes = get().votes;
    const catalog = allDecisions();
    const resolved = catalog.filter((d) => {
      const status = statusOf(votes[d.id]);
      return status !== DECISION_STATUS.PENDING && status !== DECISION_STATUS.ANALYSIS;
    }).length;
    return catalog.length === 0 ? 0 : Math.round((resolved / catalog.length) * 100);
  },

  /** Concordância ponderada pelo peso, considerando apenas o que já foi decidido pelos dois. */
  compatibility() {
    const votes = get().votes;
    let agreed = 0;
    let total = 0;
    for (const decision of allDecisions()) {
      const status = statusOf(votes[decision.id]);
      if (status === DECISION_STATUS.PENDING || status === DECISION_STATUS.ANALYSIS) continue;
      total += decision.weight;
      if (status !== DECISION_STATUS.NEGOTIATION) agreed += decision.weight;
    }
    return total === 0 ? 100 : Math.round((agreed / total) * 100);
  },

  counts() {
    const votes = get().votes;
    const tally = { unanimous: 0, veto: 0, negotiation: 0, analysis: 0, pending: 0 };
    const catalog = allDecisions();
    for (const decision of catalog) tally[statusOf(votes[decision.id])] += 1;
    return { ...tally, total: catalog.length };
  },

  secrets() {
    return { found: get().secrets.length, total: easterEggs.length };
  },
};
