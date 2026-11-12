const HOLIDAY_BUFFER = 10;

async function fetchFredObservations(seriesId, limit) {
  if (!process.env.FRED_API_KEY) {
    throw new Error('FRED_API_KEY is not set');
  }
  const response = await fetch(
    `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error(`FRED request failed for ${seriesId}: ${response.status}`);
  }

  return response.json();
}

// Turns a FRED observations response into { date, value } objects, oldest first.
// Skips days without data (FRED marks them with ".").
export function parseObservations(json) {
  if (!Array.isArray(json?.observations)) {
    throw new Error('FRED response: missing observations');
  }

  return json.observations
    .filter((observation) => observation.value !== '.')
    .map(({ date, value }) => {
      const number = Number(value);
      if (Number.isNaN(number)) {
        throw new Error(`FRED response: invalid value on ${date}`);
      }
      return { date, value: number };
    })
    .toReversed();
}

export async function getRecentFredSeries(seriesId, count) {
  const json = await fetchFredObservations(seriesId, count + HOLIDAY_BUFFER);
  return parseObservations(json).slice(-count);
}
