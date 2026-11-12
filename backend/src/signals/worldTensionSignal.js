import { getEventsForFile, listFileTimes } from '../clients/gdeltClient.js';
import {
  getMissingFileTimes,
  saveFileSummary,
  getDaySummary,
} from '../services/newsSummaryService.js';
import { scoreFromAnchors } from '../utils/scoreFromAnchors.js';
import { DAY_MS } from '../utils/dailyHistory.js';

const KEY_COUNTRIES = new Set([
  'USA',
  'CHN',
  'RUS',
  'DEU',
  'FRA',
  'GBR',
  'ITA',
  'POL',
  'UKR',
  'JPN',
  'KOR',
  'TWN',
  'PRK',
  'IND',
  'PAK',
  'ISR',
  'IRN',
  'SAU',
  'ARE',
  'QAT',
  'TUR',
  'EGY',
  'IRQ',
  'SYR',
  'LBN',
  'YEM',
  'PSE',
]);

const STATE_ACTOR_TYPES = new Set(['GOV', 'MIL']);
const MIN_MENTIONS = 5;
const SIGNAL = 'world_tension';

const PUBLISH_DELAY_MS = 60 * 60 * 1000;

const WORLD_TENSION_ANCHORS = [
  { value: 1.0, score: 0 },
  { value: 1.4, score: 25 },
  { value: 1.8, score: 50 },
  { value: 2.25, score: 75 },
  { value: 3.0, score: 100 },
];

export async function getWorldTensionSnapshots() {
  const now = new Date();
  const today = startOfUtcDay(now);
  const yesterday = new Date(today.getTime() - DAY_MS);

  await processMissingFiles(listFileTimes(yesterday, now), now);

  const windows = [
    { day: yesterday, start: yesterday, end: today },
    { day: today, start: new Date(now.getTime() - DAY_MS), end: now },
  ];

  const snapshots = [];

  for (const { day, start, end } of windows) {
    const snapshot = await buildSnapshot(day, start, end);

    if (snapshot !== null) {
      snapshots.push(snapshot);
    }
  }

  return snapshots;
}

// Returns midnight (00:00 UTC) of the given date's day.
function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

async function processMissingFiles(fileTimes, now) {
  // From a list of file times, returns those not yet saved in NewsFileSummary
  const missing = await getMissingFileTimes(SIGNAL, fileTimes);

  for (const fileTime of missing) {
    const events = await getEventsForFile(fileTime);

    // File is missing: if it's over an hour old, GDELT skipped it, so save an empty summary.
    // If it's recent, it may not be published yet, so try again next run.
    if (events === null) {
      const isOld = now.getTime() - fileTime.getTime() > PUBLISH_DELAY_MS;

      if (isOld) {
        await saveFileSummary(SIGNAL, fileTime, { weightedSum: 0, mentions: 0 });
      }

      continue;
    }

    await saveFileSummary(SIGNAL, fileTime, summarizeEvents(events));
  }
}

// Sums one file's relevant events into { weightedSum, mentions }.
// weightedSum = Σ conflict strength × mentions, where cooperation counts as 0.
export function summarizeEvents(events) {
  return events.filter(isRelevantEvent).reduce(
    (summary, event) => ({
      weightedSum: summary.weightedSum + Math.max(0, -event.goldstein) * event.mentions,
      mentions: summary.mentions + event.mentions,
    }),
    { weightedSum: 0, mentions: 0 },
  );
}

// Returns true if the event matters for world tension:
// main event of the article, at least 5 mentions, involves a key country,
// and is between two countries or done by a government/military.
export function isRelevantEvent(event) {
  return (
    event.isRootEvent &&
    event.mentions >= MIN_MENTIONS &&
    involvesKeyCountry(event) &&
    (isInternational(event) || isStateAction(event))
  );
}

export function involvesKeyCountry(event) {
  return KEY_COUNTRIES.has(event.actor1Country) || KEY_COUNTRIES.has(event.actor2Country);
}

export function isInternational(event) {
  return (
    event.actor1Country !== '' &&
    event.actor2Country !== '' &&
    event.actor1Country !== event.actor2Country
  );
}

export function isStateAction(event) {
  return STATE_ACTOR_TYPES.has(event.actor1Type);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

async function buildSnapshot(day, windowStart, windowEnd) {
  const summary = await getDaySummary(SIGNAL, windowStart, windowEnd);
  return toWorldTensionSnapshot(day, summary);
}

export function toWorldTensionSnapshot(day, { weightedSum, mentions }) {
  if (mentions === 0) {
    return null;
  }

  const value = weightedSum / mentions;

  return {
    signal: SIGNAL,
    date: toIsoDate(day),
    value,
    score: scoreFromAnchors(value, WORLD_TENSION_ANCHORS),
  };
}
