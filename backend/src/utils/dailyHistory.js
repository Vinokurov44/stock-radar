export const DAY_MS = 24 * 60 * 60 * 1000;

export const HISTORY_DAYS = 7;

// Today's date in UTC, e.g. '2026-10-24'.
export function getTodayUtc() {
  return new Date().toISOString().slice(0, 10);
}

//Returns the last relevant snapshot date.
//If we asking for too old date return null.
//If we asking for too new date return the last one in db.
export function getValueAsOf(snapshots, date) {
  return snapshots.findLast((snapshot) => snapshot.date <= date) ?? null;
}

// Returns `count` ISO dates ending at `endDate`, oldest first.
// Works across month and year boundaries because it subtracts whole days in UTC.
export function getLastDates(endDate, count) {
  const endTime = new Date(`${endDate}T00:00:00Z`).getTime();

  return Array.from({ length: count }, (_, i) => {
    const daysBack = count - 1 - i;
    return new Date(endTime - daysBack * DAY_MS).toISOString().slice(0, 10);
  });
}

// Builds one point per calendar date using the last known snapshot.
// On weekends and holidays market signals keep their last trading-day value.
// `sourceDate` is the date of the snapshot that was actually used.
export function buildDailyHistory(snapshots, dates) {
  return dates.map((date) => {
    const snapshot = getValueAsOf(snapshots, date);

    if (!snapshot) {
      return { date, value: null, score: null, sourceDate: null };
    }

    return { date, value: snapshot.value, score: snapshot.score, sourceDate: snapshot.date };
  });
}
