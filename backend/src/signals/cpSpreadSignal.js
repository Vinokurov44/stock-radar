import { getRecentFredSeries } from '../clients/fredClient.js';
import { scoreFromAnchors } from '../utils/scoreFromAnchors.js';

const SIGNAL = 'cp_spread';
const A2P2_SERIES = 'RIFSPPNA2P2D30NB'; // 30-day A2/P2 nonfinancial commercial paper
const AA_SERIES = 'RIFSPPNAAD30NB'; // 30-day AA nonfinancial commercial paper
const SMOOTHING_DAYS = 3;
const FETCH_BUFFER = 10; // extra rows in case the two series have different gaps

// 3-day average spread between A2/P2 and AA commercial paper (bp) -> stress score.
// Calibrated on history: calm 2017-2019 ~29, SVB 2023 peak ~96, COVID 2020 peak ~199.
const CP_SPREAD_ANCHORS = [
  { value: 15, score: 0 },
  { value: 22, score: 25 }, // Normal starts
  { value: 35, score: 50 }, // Tense starts
  { value: 50, score: 75 }, // Fear starts
  { value: 70, score: 90 }, // Crisis starts
  { value: 200, score: 100 },
];

// Fetches both series from FRED and builds snapshots for the last `days` days.
export async function getCpSpreadSnapshots(days) {
  const count = days + SMOOTHING_DAYS - 1 + FETCH_BUFFER;
  const [a2p2, aa] = await Promise.all([
    getRecentFredSeries(A2P2_SERIES, count),
    getRecentFredSeries(AA_SERIES, count),
  ]);

  return toCpSpreadSnapshots(buildSpreads(a2p2, aa), days);
}

// Builds snapshots for the last `days` days.
// Each value is the average spread of that day and the previous SMOOTHING_DAYS - 1 days.
export function toCpSpreadSnapshots(spreads, days) {
  const needed = days + SMOOTHING_DAYS - 1;
  if (spreads.length < needed) {
    throw new Error(`CP spread needs ${needed} spreads, got ${spreads.length}`);
  }

  const start = spreads.length - days;

  return spreads.slice(-days).map((point, k) => {
    const end = start + k + 1; // index after the current day
    const window = spreads.slice(end - SMOOTHING_DAYS, end);
    const sum = window.reduce((total, spread) => total + spread.value, 0);
    const value = Math.round(sum / SMOOTHING_DAYS);

    return {
      signal: SIGNAL,
      date: point.date,
      value,
      score: scoreFromAnchors(value, CP_SPREAD_ANCHORS),
    };
  });
}

// Spread in bp on dates where both series have a value, oldest first.
export function buildSpreads(a2p2, aa) {
  const aaByDate = new Map(aa.map(({ date, value }) => [date, value]));

  return a2p2
    .filter(({ date }) => aaByDate.has(date))
    .map(({ date, value }) => ({ date, value: (value - aaByDate.get(date)) * 100 }));
}
