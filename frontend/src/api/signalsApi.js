import { API_URL } from './config.js';

export async function fetchSignals() {
  const response = await fetch(`${API_URL}/api/signals`);
  if (!response.ok) {
    throw new Error(`Signal fetching error: ${response.status}`);
  }
  return response.json();
}
