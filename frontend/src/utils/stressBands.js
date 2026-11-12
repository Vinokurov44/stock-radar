export const STRESS_BANDS = [
  { from: 0, to: 25, label: 'Calm', color: '#4ade80' },
  { from: 25, to: 50, label: 'Normal', color: '#a3e635' },
  { from: 50, to: 75, label: 'Tense', color: '#facc15' },
  { from: 75, to: 90, label: 'Fear', color: '#fb923c' },
  { from: 90, to: 100, label: 'Crisis', color: '#f87171' },
];

export function getStressBand(score) {
  return STRESS_BANDS.find((band) => score < band.to) ?? STRESS_BANDS.at(-1);
}
const STRESS_UP_COLOR = '#fb923c'; // stress rising`
const STRESS_DOWN_COLOR = '#4ade80'; // stress easing

// Color for a score change: rising stress is warm, easing stress is green, no change has no color.
export function getChangeColor(change) {
  if (change > 0) {
    return STRESS_UP_COLOR;
  }
  if (change < 0) {
    return STRESS_DOWN_COLOR;
  }
  return undefined; // keeps the default muted text color
}
