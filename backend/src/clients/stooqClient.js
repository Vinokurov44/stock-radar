const STOOQ_CSV_URL = 'https://stooq.com/q/d/l/?s=';

async function fetchStqCsv(symbol) {
  const response = await fetch(`${STOOQ_CSV_URL}${symbol}&i=d`);
  if (!response.ok) {
    throw new Error(`Stooq request failed for ${symbol}: ${response.status}`);
  }
  return response.text();
}

export function parseDailyCloses(csvText, symbol, count) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].trim().split(',');
  const dateIndex = headers.indexOf('Date');
  const closeIndex = headers.indexOf('Close');
  if (dateIndex === -1 || closeIndex === -1) {
    throw new Error(`Unexpected Stooq response for ${symbol}`);
  }

  const dataLines = lines.slice(1).slice(-count);
  if (dataLines.length === 0) {
    throw new Error(`No Stooq data for ${symbol}`);
  }
  return dataLines.map((line) => {
    const columns = line.trim().split(',');
    const close = Number(columns[closeIndex]);

    if (Number.isNaN(close)) {
      throw new Error(`Unexpected Stooq response for ${symbol}`);
    }

    return { date: columns[dateIndex], close };
  });
}

export async function getDailyCloses(symbol, count) {
  const csv = await fetchStqCsv(symbol);
  return parseDailyCloses(csv, symbol, count);
}
