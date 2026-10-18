export function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\u2026`;
}

export function yearsSince(dateStr) {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (365 * 24 * 60 * 60 * 1000));
}

export function percent(part, total) {
  if (!total) return '0%';
  return `${Math.round(part / total)}%`;
}

export function compact(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function rupees(amount) {
  return `\u20b9${amount}`;
}

export function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
