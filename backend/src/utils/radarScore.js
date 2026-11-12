import { DAY_MS } from './dailyHistory.js';

const MAX_STALE_DAYS = 5; // older snapshot -> source is probably broken, skip it

// Weights of each signal in the radar score. Must sum to 1.
export const RADAR_WEIGHTS = {
  vix: 0.25,
  world_tension: 0.25,
  fsi: 0.15,
  rate_shock: 0.15,
  cp_spread: 0.1,
  fng: 0.1,
};

const ELEVATED_SCORE = 50; // Tense or higher
const MIN_SIGNALS = 4; // fewer available signals -> no radar score

// Fail fast if someone edits a weight and forgets to rebalance the others.
const weightSum = Object.values(RADAR_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
if (Math.abs(weightSum - 1) > 1e-9) {
  throw new Error(`RADAR_WEIGHTS must sum to 1, got ${weightSum}`);
}

// More signals under stress at the same time -> stronger boost.
function getEscalationMultiplier(elevatedCount) {
  if (elevatedCount >= 4) return 1.5;
  if (elevatedCount === 3) return 1.35;
  if (elevatedCount === 2) return 1.2;
  return 1;
}

// components: [{ signal, score }] for one day, only signals that are fresh enough.
// Returns a score 0-100, or null when too few signals are available.
export function computeRadarScore(components) {
  const available = components.filter(({ signal }) => signal in RADAR_WEIGHTS);
  if (available.length < MIN_SIGNALS) {
    return null;
  }

  // Missing signals: their weight is shared by the others proportionally.
  const totalWeight = available.reduce((sum, { signal }) => sum + RADAR_WEIGHTS[signal], 0);
  const weightedSum = available.reduce(
    (sum, { signal, score }) => sum + score * RADAR_WEIGHTS[signal],
    0,
  );
  const weighted = weightedSum / totalWeight;

  const elevatedCount = available.filter(({ score }) => score >= ELEVATED_SCORE).length;
  const multiplier = getEscalationMultiplier(elevatedCount);

  return Math.min(100, Math.round(weighted * multiplier));
}

function daysBetween(fromDate, toDate) {
  return (Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) / DAY_MS;
}

// signals: [{ signal, history: [{ date, score, sourceDate }] }] — the output of getLatestSnapshots.
// Returns one radar point per date: { date, score, components }.
export function buildRadarHistory(signals, dates) {
  return dates.map((date) => {
    const components = signals
      .map(({ signal, history }) => {
        const point = history.find((item) => item.date === date);
        return { signal, point };
      })
      .filter(({ point }) => point && point.score !== null)
      .filter(({ point }) => daysBetween(point.sourceDate, date) <= MAX_STALE_DAYS)
      .map(({ signal, point }) => ({ signal, score: point.score }));

    return { date, score: computeRadarScore(components), components };
  });
}
