const FSI_CSV_URL = 'https://www.financialresearch.gov/financial-stress-index/data/fsi.csv?';

export async function fetchFsiCsv() {
  const response = await fetch(FSI_CSV_URL);
  if (!response.ok) {
    throw new Error(`OFR request failed ${response.status}`);
  }
  return response.text();
}
function parseFsiLine(line, fsiIndex) {
  const columns = line.trim().split(',');
  const date = columns[0];
  const value = Number(columns[fsiIndex]);

  if (Number.isNaN(value)) {
    throw new Error('Unexpected OFR CSV format');
  }

  return { date, value };
}

export function parseRecentFsi(csvText, count) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].trim().split(',');
  const fsiIndex = headers.indexOf('OFR FSI');

  if (fsiIndex === -1) {
    throw new Error('Unexpected OFR CSV format');
  }

  return lines
    .slice(1)
    .slice(-count)
    .map((line) => parseFsiLine(line, fsiIndex));
}

export async function getRecentFsi(count) {
  const csv = await fetchFsiCsv();
  return parseRecentFsi(csv, count);
}
