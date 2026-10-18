const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Formats an ISO date (yyyy-mm-dd) without relying on the runtime time zone
 * or locale, so server and client render identical text (no hydration drift).
 */
export function formatFixtureDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${weekday}, ${d} ${MONTHS[m - 1]} ${y}`;
}

export function formatShortDate(iso: string): { day: string; month: string } {
  const [, m, d] = iso.split('-').map(Number);
  return { day: String(d).padStart(2, '0'), month: MONTHS[m - 1] };
}

/** 24h "18:30" → "6:30 PM". */
export function formatTime(time: string): string {
  const [h, min] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(min).padStart(2, '0')} ${suffix}`;
}

/** Indian-grouped rupee amount, e.g. 60000 → "₹60,000". Locale-independent. */
export function formatINR(amount: number): string {
  const digits = String(Math.round(amount));
  if (digits.length <= 3) return `₹${digits}`;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `₹${rest},${last3}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function cx(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ');
}

export function winRate(wins: number, played: number): number {
  return played === 0 ? 0 : Math.round((wins / played) * 100);
}
