/**
 * Contagem regressiva para a data do casamento.
 * Datas vêm de data.js em ISO com fuso de Brasília — nada de string hardcoded aqui.
 */

const UNITS = [
  { key: 'days', label: 'dias' },
  { key: 'hours', label: 'horas' },
  { key: 'minutes', label: 'min' },
  { key: 'seconds', label: 'seg' },
];

function timeUntil(target, from = Date.now()) {
  const total = Math.max(0, new Date(target).getTime() - from);
  const seconds = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}

export const daysUntil = (target, from = Date.now()) => timeUntil(target, from).days;

export function mountCountdown(host, target) {
  const cells = UNITS.map(({ key, label }) => {
    const unit = document.createElement('div');
    unit.className = 'countdown__unit';

    const value = document.createElement('span');
    value.className = 'countdown__value tabular';

    const name = document.createElement('span');
    name.className = 'countdown__label';
    name.textContent = label;

    unit.append(value, name);
    return { key, value, unit };
  });

  host.replaceChildren(...cells.map((cell) => cell.unit));

  const update = () => {
    const remaining = timeUntil(target);
    for (const cell of cells) {
      const raw = remaining[cell.key];
      cell.value.textContent = cell.key === 'days' ? String(raw) : String(raw).padStart(2, '0');
    }
    host.setAttribute(
      'aria-label',
      `Faltam ${remaining.days} dias, ${remaining.hours} horas e ${remaining.minutes} minutos`,
    );
  };

  update();
  setInterval(update, 1000);
  // Abas em segundo plano têm timers estrangulados: ressincroniza ao voltar.
  document.addEventListener('visibilitychange', update);
}
