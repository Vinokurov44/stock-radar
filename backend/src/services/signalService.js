import SignalSnapshot, { SIGNAL_NAMES } from '../models/SignalSnapshot.js';
import {
  buildDailyHistory,
  getLastDates,
  getTodayUtc,
  HISTORY_DAYS,
} from '../utils/dailyHistory.js';

const HISTORY_LOOKBACK = 15;

export async function saveSnapshot(snapshot) {
  await SignalSnapshot.validate(snapshot);
  await SignalSnapshot.updateOne(
    { signal: snapshot.signal, date: snapshot.date },
    { $set: snapshot },
    { upsert: true, runValidators: true },
  );
}
export async function getLatestSnapshots(dates = getLastDates(getTodayUtc(), HISTORY_DAYS)) {
  const result = [];

  for (const name of SIGNAL_NAMES) {
    const recent = await SignalSnapshot.find({ signal: name })
      .sort({ date: -1 })
      .limit(HISTORY_LOOKBACK)
      .lean();

    if (recent.length === 0) {
      continue;
    }

    const latest = recent[0];
    const history = buildDailyHistory(recent.toReversed(), dates);
    const values = history.map((point) => point.value).filter((value) => value !== null);

    if (values.length < 2) {
      result.push({ ...latest, history });
      continue;
    }

    result.push({
      ...latest,
      weekLow: Math.min(...values),
      weekHigh: Math.max(...values),
      history,
    });
  }

  return result;
}
