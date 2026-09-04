/**
 * Única camada autorizada a tocar em localStorage.
 * Nenhum outro módulo deve importar `window.localStorage` diretamente.
 */

const NAMESPACE = 'weddingos';
export const SCHEMA = 1;
const KEY = `${NAMESPACE}:v${SCHEMA}`;

/** localStorage lança em modo privado/quota cheia — a experiência não pode morrer por isso. */
function available() {
  try {
    const probe = `${NAMESPACE}:probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const enabled = available();

export function load() {
  if (!enabled) return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schema !== SCHEMA) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function save(state) {
  if (!enabled) return false;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Remove todas as chaves do namespace, inclusive schemas antigos. */
export function clear() {
  if (!enabled) return false;
  try {
    const stale = Object.keys(localStorage).filter((k) => k.startsWith(`${NAMESPACE}:`));
    stale.forEach((k) => localStorage.removeItem(k));
    return true;
  } catch {
    return false;
  }
}
