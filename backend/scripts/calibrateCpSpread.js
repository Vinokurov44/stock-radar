import { getRecentFredSeries } from '../src/clients/fredClient.js';

const A2P2 = 'RIFSPPNA2P2D30NB';
const AA = 'RIFSPPNAAD30NB';
const HISTORY = 8000; // more than all trading days since 1997

const [a2p2, aa] = await Promise.all([
  getRecentFredSeries(A2P2, HISTORY),
  getRecentFredSeries(AA, HISTORY),
]);

// Spread only on dates where both series have a value.
const aaByDate = new Map(aa.map(({ date, value }) => [date, value]));
const spreads = a2p2
  .filter(({ date }) => aaByDate.has(date))
  .map(({ date, value }) => ({ date, value: (value - aaByDate.get(date)) * 100 }));

// 3-day average to reduce noise.
const smoothed = spreads.slice(2).map((point, k) => ({
  date: point.date,
  value: (spreads[k].value + spreads[k + 1].value + point.value) / 3,
}));

function percentile(values, p) {
  const sorted = values.toSorted((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[index];
}

function between(from, to) {
  return smoothed.filter(({ date }) => date >= from && date <= to);
}

function describe(label, points) {
  const values = points.map(({ value }) => value);
  if (values.length === 0) {
    console.log(`${label}: no data`);
    return;
  }
  const show = (p) => percentile(values, p).toFixed(0);
  console.log(
    `${label}: n=${values.length} p50=${show(50)} p75=${show(75)} p90=${show(90)} ` +
      `p95=${show(95)} max=${Math.max(...values).toFixed(0)}`,
  );
}

describe('All since 1997 ', smoothed);
describe('Calm 2017-2019 ', between('2017-01-01', '2019-12-31'));
describe('Crisis 2008    ', between('2008-09-01', '2008-12-31'));
describe('COVID 2020     ', between('2020-03-01', '2020-04-30'));
describe('SVB 2023       ', between('2023-03-08', '2023-04-15'));
describe('August 2024    ', between('2024-07-25', '2024-08-20'));
describe('April 2025     ', between('2025-04-01', '2025-04-30'));
describe('Last 90 days   ', smoothed.slice(-90));
