const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Renders a stored timestamp as "4 Oct 2026". */
export function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  const parts = parsed.toISOString().slice(0, 10).split('-');
  return `${Number(parts[2])} ${MONTHS[Number(parts[1]) - 1]} ${parts[0]}`;
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function daysUntil(value) {
  return Math.floor((new Date(value).getTime() - Date.now()) / 86400000);
}

export function isPast(value) {
  return new Date(value).getTime() < Date.now();
}

/** Comparator: newest first, for any field holding a date string. */
export function byNewest(field) {
  return (a, b) => new Date(b[field]) - new Date(a[field]);
}

export function relative(value) {
  const days = daysUntil(value);
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days > 1) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
}
