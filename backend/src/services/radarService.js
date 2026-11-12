import { getLastDates, getTodayUtc, HISTORY_DAYS } from '../utils/dailyHistory.js';
import { buildRadarHistory } from '../utils/radarScore.js';
import { getLatestSnapshots } from './signalService.js';

export async function getRadar() {
  const dates = getLastDates(getTodayUtc(), HISTORY_DAYS);
  const signals = await getLatestSnapshots(dates);

  const times = signals.map(({ updatedAt }) => updatedAt.getTime());
  const latestTime = Math.max(...times);
  const updatedAt = new Date(latestTime);

  const history = buildRadarHistory(signals, dates);
  return { latest: history.at(-1), history, updatedAt };
}
