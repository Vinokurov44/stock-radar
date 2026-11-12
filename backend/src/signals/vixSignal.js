import { getRecentVix } from '../clients/cboClients.js';
import { scoreFromAnchors } from '../utils/scoreFromAnchors.js';

const VIX_ANCHORS = [
  { value: 10, score: 0 },
  { value: 15, score: 25 },
  { value: 20, score: 50 },
  { value: 30, score: 75 },
  { value: 45, score: 100 },
];

export async function getVixSnapshots(days) {
  const recentDays = await getRecentVix(days);

  return recentDays.map(({ date, open, high, low, close }) => ({
    signal: 'vix',
    date,
    value: close,
    open,
    high,
    low,
    score: scoreFromAnchors(close, VIX_ANCHORS),
  }));
}
