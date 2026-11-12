import { getRecentFredSeries } from '../src/clients/fredClient.js';

const WINDOW_DAYS = 20;
const yields = await getRecentFredSeries('DGS10', 17000); // all history since 1962

// 20-day change in bp for every day.
const changes = yields.slice(WINDOW_DAYS).map((point, k) => ({
  date: point.date,
  value: (point.value - yields[k].value) * 100,
}));

function percentile(values, p) {
  const sorted = values.toSorted((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

function describe(label, points) {
  const abs = points.map(({ value }) => Math.abs(value));
  if (abs.length === 0) {
    console.log(`${label}: no data`);
    return;
  }
  const show = (p) => percentile(abs, p).toFixed(0);
  const signed = points.map(({ value }) => value);
  console.log(
    `${label}: n=${abs.length} |p50|=${show(50)} |p75|=${show(75)} |p90|=${show(90)} ` +
      `|p95|=${show(95)} min=${Math.min(...signed).toFixed(0)} max=${Math.max(...signed).toFixed(0)}`,
  );
}

const between = (from, to) => changes.filter(({ date }) => date >= from && date <= to);

describe('Since 2000     ', between('2000-01-01', '2099-12-31'));
describe('Calm 2017-2019 ', between('2017-01-01', '2019-12-31'));
describe('Crisis 2008    ', between('2008-09-01', '2008-12-31'));
describe('COVID 2020     ', between('2020-03-01', '2020-04-30'));
describe('Hikes 2022     ', between('2022-01-01', '2022-12-31'));
describe('Autumn 2023    ', between('2023-09-15', '2023-11-15'));
describe('April 2025     ', between('2025-04-01', '2025-05-15'));
describe('Last 90 days   ', changes.slice(-90));
