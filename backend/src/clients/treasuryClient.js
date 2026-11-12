const TREASURY_CSV_URL_START =
  'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/';

const TREASURY_CSV_URL_END = '/all?type=daily_treasury_yield_curve&field_tdr_date_value=';

async function fetchTreasuryCsv(year) {
  const response = await fetch(
    `${TREASURY_CSV_URL_START}${year}${TREASURY_CSV_URL_END}${year}&page&_format=csv`,
  );
  if (!response.ok) {
    throw new Error(`Treasury request failed for ${year}: ${response.status}`);
  }
  return response.text();
}

// Parses the Treasury CSV into { date, value } objects, oldest first.
export function parseTenYearYields(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0]
    .trim()
    .split(',')
    .map((header) => header.replaceAll('"', ''));
  const dateIndex = headers.indexOf('Date');
  const tenYearIndex = headers.indexOf('10 Yr');

  if (dateIndex === -1 || tenYearIndex === -1) {
    throw new Error(`Unexpected Treasury response`);
  }

  const dataLines = lines.slice(1);
  return dataLines
    .map((line) => {
      const columns = line.trim().split(',');
      const [month, day, year] = columns[dateIndex].split('/');
      const date = `${year}-${month}-${day}`;
      const value = Number(columns[tenYearIndex]);
      if (Number.isNaN(value)) {
        throw new Error(`Unexpected Treasury response`);
      }
      return { date, value };
    })
    .toReversed();
}

// Returns the last `count` 10-year yields, oldest first.
// In early January, also uses the previous year's file.
export async function getRecentTenYearYields(count) {
  const year = new Date().getUTCFullYear();
  const currentYields = parseTenYearYields(await fetchTreasuryCsv(year));

  if (currentYields.length >= count) {
    return currentYields.slice(-count);
  }

  const previousYields = parseTenYearYields(await fetchTreasuryCsv(year - 1));
  return [...previousYields, ...currentYields].slice(-count);
}
