import { getRecentFsi } from '../clients/ofrClient.js';
import { scoreFromAnchors } from '../utils/scoreFromAnchors.js';

const FSI_ANCHORS = [
  { value: -3, score: 0 },
  { value: -2, score: 25 },
  { value: 0, score: 50 },
  { value: 5, score: 75 },
  { value: 12, score: 100 },
];

export async function getFsiSnapshots(days) {
  const recentDays = await getRecentFsi(days);

  return recentDays.map(({ date, value }) => ({
    signal: 'fsi',
    date,
    value,
    score: scoreFromAnchors(value, FSI_ANCHORS),
  }));
}
