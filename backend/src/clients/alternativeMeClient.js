const ALT_FNG_URL = 'https://api.alternative.me/fng/';

async function fetchFearGreed(days) {
  const response = await fetch(`${ALT_FNG_URL}?limit=${days}`);
  if (!response.ok) {
    throw new Error(`Reqiest to alternative.me is failed ${response.status}`);
  }

  return response.json();
}

export function parseFearGreed(json) {
  if (json.metadata.error != null) {
    throw new Error(`Alternative.me error: ${json.metadata.error}`);
  }

  return json.data.toReversed().map((item) => {
    const value = Number(item.value);

    if (Number.isNaN(value)) {
      throw new Error('Unexpected Alternative.me response format');
    }

    return {
      date: new Date(Number(item.timestamp) * 1000).toISOString().slice(0, 10),
      value,
    };
  });
}

export async function getRecentFearGreed(days) {
  const json = await fetchFearGreed(days);
  return parseFearGreed(json);
}
