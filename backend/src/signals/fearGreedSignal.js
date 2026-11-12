import { getRecentFearGreed } from '../clients/alternativeMeClient.js';
import { scoreFromAnchors } from '../utils/scoreFromAnchors.js';

const FEAR_GREED_ANCHORS = [
  { value: 0, score: 100 },
  { value: 100, score: 0 },
];

export async function getFearGreedsnapshot(days) {
  const recentDays = await getRecentFearGreed(days);

  return recentDays.map(({ date, value }) => ({
    signal: 'fng',
    date,
    value,
    score: scoreFromAnchors(value, FEAR_GREED_ANCHORS),
  }));
}
