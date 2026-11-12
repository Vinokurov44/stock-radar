import { API_URL } from './config.js';

export async function fetchRadar() {
  const response = await fetch(`${API_URL}/api/radar`);
  if (!response.ok) {
    throw new Error(`Radar fetching error: ${response.status}`);
  }
  return response.json();
}
