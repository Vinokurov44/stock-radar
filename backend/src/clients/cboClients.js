const VIX_CSV_URL = 'https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv';

async function fetchVixCsv() {
  const response = await fetch(VIX_CSV_URL);
  if (!response.ok) {
    throw new Error(`Cboe request failed: ${response.status}`);
  }

  return response.text();
}

export function parseVixLine(line) {
  const [rawDate, rawOpen, rawHigh, rawLow, rawClose] = line.trim().split(',');

  const [month, day, year] = rawDate.split('/');
  const date = `${year}-${month}-${day}`;

  const open = Number(rawOpen);
  const high = Number(rawHigh);
  const low = Number(rawLow);
  const close = Number(rawClose);

  if (Number.isNaN(open) || Number.isNaN(high) || Number.isNaN(low) || Number.isNaN(close)) {
    throw new Error('Unexpected Cboe CSV format');
  }

  return { date, open, high, low, close };
}

export function parseRecentVix(csvText, count) {
  const dataLines = csvText.trim().split('\n').slice(1);
  return dataLines.slice(-count).map(parseVixLine);
}

export async function getRecentVix(count) {
  const csv = await fetchVixCsv();
  return parseRecentVix(csv, count);
}
