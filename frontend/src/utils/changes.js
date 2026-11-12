// "▲ +19", "▼ −5" or "0" for a score change.
export function formatChange(change) {
  if (change > 0) {
    return `▲ +${change}`;
  }
  if (change < 0) {
    return `▼ −${Math.abs(change)}`;
  }
  return '0';
}
