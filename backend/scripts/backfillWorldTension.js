import mongoose from 'mongoose';
import { getEventsForFile, listFileTimes } from '../src/clients/gdeltClient.js';
import { summarizeEvents, toWorldTensionSnapshot } from '../src/signals/worldTensionSignal.js';
import { saveSnapshot } from '../src/services/signalService.js';
import SignalSnapshot from '../src/models/SignalSnapshot.js';

const DAYS_BACK = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

async function summarizeDay(dayStart) {
  const lastFileTime = new Date(dayStart.getTime() + DAY_MS - FIFTEEN_MINUTES_MS);
  let total = { weightedSum: 0, mentions: 0 };

  for (const fileTime of listFileTimes(dayStart, lastFileTime)) {
    const events = await getEventsForFile(fileTime);

    if (events === null) {
      continue;
    }

    const summary = summarizeEvents(events);
    total = {
      weightedSum: total.weightedSum + summary.weightedSum,
      mentions: total.mentions + summary.mentions,
    };
  }

  return total;
}

await mongoose.connect(process.env.MONGODB_URI);

const existing = await SignalSnapshot.find({ signal: 'world_tension' }).select('date').lean();
const savedDates = new Set(existing.map((snapshot) => snapshot.date));

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

for (let daysAgo = DAYS_BACK; daysAgo >= 2; daysAgo--) {
  const dayStart = new Date(today.getTime() - daysAgo * DAY_MS);
  const date = dayStart.toISOString().slice(0, 10);

  if (savedDates.has(date)) {
    console.log('skip', date);
    continue;
  }

  const snapshot = toWorldTensionSnapshot(dayStart, await summarizeDay(dayStart));

  if (snapshot !== null) {
    await saveSnapshot(snapshot);
    console.log('saved', date, snapshot.value.toFixed(2), snapshot.score);
  }
}

await mongoose.disconnect();
