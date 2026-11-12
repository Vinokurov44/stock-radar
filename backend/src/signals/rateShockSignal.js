import { getRecentTenYearYields } from '../clients/treasuryClient.js';
import { scoreFromAnchors } from '../utils/scoreFromAnchors.js';

const SIGNAL = 'rate_shock';
const WINDOW_DAYS = 20;

const RATE_SHOCK_ANCHORS = [
  { value: 0, score: 0 },
  { value: 15, score: 25 }, // Normal starts
  { value: 30, score: 50 }, // Tense starts
  { value: 50, score: 75 }, // Fear starts
  { value: 75, score: 90 }, // Crisis starts
  { value: 100, score: 100 },
];

// Fetches enough yields and builds snapshots for the last `days` days.
export function toRateShockSnapshots(yields, days) {
  if (yields.length < days + WINDOW_DAYS) {
    throw new Error(`Rate shock needs ${days + WINDOW_DAYS} yields, got ${yields.length}`);
  }
  const start = yields.length - days;

  return yields.slice(-days).map((point, k) => {
    const past = yields[start + k - WINDOW_DAYS];

    const change = Math.round((point.value - past.value) * 100);

    return {
      signal: 'rate_shock',
      date: point.date,
      value: change,
      score: scoreFromAnchors(Math.abs(change), RATE_SHOCK_ANCHORS),
    };
  });
}

//We got all needed objects: [{date, value}...]
export async function getRateShockSnapshots(days) {
  const yields = await getRecentTenYearYields(days + WINDOW_DAYS);
  return toRateShockSnapshots(yields, days);
}
