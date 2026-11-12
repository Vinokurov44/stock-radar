import NewsFileSummary from '../models/NewsFileSummary.js';

// From a list of file times, returns those not yet saved in NewsFileSummary.
export async function getMissingFileTimes(signal, fileTimes) {
  const existing = await NewsFileSummary.find({
    signal,
    fileTime: { $in: fileTimes },
  })
    .select('fileTime')
    .lean();

  const existingTimes = new Set(existing.map((summary) => summary.fileTime.getTime()));

  return fileTimes.filter((fileTime) => !existingTimes.has(fileTime.getTime()));
}

// Saves file's summary to NewsFileSummary(DB).
// Creates it, or overwrites it if the file was already processed.
export async function saveFileSummary(signal, fileTime, summary) {
  await NewsFileSummary.updateOne(
    { signal, fileTime },
    { $set: { signal, fileTime, ...summary } },
    { upsert: true, runValidators: true },
  );
}

// Sums all file summaries of a signal within a time window [dayStart, dayEnd)
export async function getDaySummary(signal, dayStart, dayEnd) {
  const summaries = await NewsFileSummary.find({
    signal,
    fileTime: { $gte: dayStart, $lt: dayEnd },
  }).lean();

  return summaries.reduce(
    (total, summary) => ({
      weightedSum: total.weightedSum + summary.weightedSum,
      mentions: total.mentions + summary.mentions,
    }),
    { weightedSum: 0, mentions: 0 },
  );
}
