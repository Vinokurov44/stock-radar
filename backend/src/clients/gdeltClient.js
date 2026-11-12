import AdmZip from 'adm-zip';

const GDELT_BASE_URL = 'http://data.gdeltproject.org/gdeltv2';
const EVENTS_COLUMN_COUNT = 61;
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const COLUMN = {
  actor1Country: 7,
  actor1Type: 12,
  actor2Country: 17,
  isRootEvent: 25,
  quadClass: 29,
  goldstein: 30,
  mentions: 31,
  avgTone: 34,
};

// Returns GDELT file times (every 15 min) between two dates.
// The start is rounded down: 10:07 → 10:00.
export function listFileTimes(from, to) {
  const start = Math.floor(from.getTime() / FIFTEEN_MINUTES_MS) * FIFTEEN_MINUTES_MS;
  const fileTimes = [];

  for (let time = start; time <= to.getTime(); time += FIFTEEN_MINUTES_MS) {
    fileTimes.push(new Date(time));
  }

  return fileTimes;
}

// Downloads one GDELT events file by its time and returns all its events.
// Returns null if the file does not exist (404).
export async function getEventsForFile(fileTime) {
  const text = await downloadEventsText(fileTime);

  if (text === null) {
    return null;
  }

  return text
    .split('\n')
    .map((line) => line.replace(/\r$/, ''))
    .filter((line) => line.length > 0)
    .map(parseEventLine);
}

// Downloads the zipped GDELT events file and returns its text.
// Returns null if the file does not exist (404).
async function downloadEventsText(fileTime) {
  const response = await fetch(buildEventsFileUrl(fileTime));

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GDELT request failed: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const [entry] = new AdmZip(buffer).getEntries();

  if (!entry) {
    throw new Error('GDELT archive is empty');
  }

  return entry.getData().toString('utf8');
}

function buildEventsFileUrl(fileTime) {
  return `${GDELT_BASE_URL}/${toGdeltStamp(fileTime)}.export.CSV.zip`;
}

// Converts a date to GDELT's file name format: 2026-10-17 06:15 UTC → '20261017061500'.
function toGdeltStamp(date) {
  return date.toISOString().replace(/\D/g, '').slice(0, 14);
}

// Turns one tab-separated line of the GDELT file into an event object.
// Throws if the line format is unexpected (not 61 columns or not a number).
function parseEventLine(line) {
  const columns = line.split('\t');

  if (columns.length !== EVENTS_COLUMN_COUNT) {
    throw new Error('Unexpected GDELT events format');
  }

  const goldstein = Number(columns[COLUMN.goldstein]);
  const mentions = Number(columns[COLUMN.mentions]);
  const quadClass = Number(columns[COLUMN.quadClass]);
  const avgTone = Number(columns[COLUMN.avgTone]);

  if (
    Number.isNaN(goldstein) ||
    Number.isNaN(mentions) ||
    Number.isNaN(quadClass) ||
    Number.isNaN(avgTone)
  ) {
    throw new Error('Unexpected GDELT events format');
  }

  return {
    actor1Country: columns[COLUMN.actor1Country],
    actor1Type: columns[COLUMN.actor1Type],
    actor2Country: columns[COLUMN.actor2Country],
    isRootEvent: columns[COLUMN.isRootEvent] === '1',
    quadClass,
    goldstein,
    mentions,
    avgTone,
  };
}
