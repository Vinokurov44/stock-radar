import VisitDay from '../models/VisitDay.js';
import { getTodayUtc } from '../utils/dailyHistory.js';

// Adds one visit to today's counter. $inc is atomic, so visits at the same moment are not lost.
export async function recordVisit() {
  await VisitDay.updateOne({ date: getTodayUtc() }, { $inc: { count: 1 } }, { upsert: true });
}

// Total visits from the 1st of the current month (UTC) until today.
export async function getVisitsThisMonth() {
  const monthStart = `${getTodayUtc().slice(0, 7)}-01`; // '2026-11-07' -> '2026-11-01'
  const days = await VisitDay.find({ date: { $gte: monthStart } }).lean();
  return days.reduce((sum, day) => sum + day.count, 0);
}
