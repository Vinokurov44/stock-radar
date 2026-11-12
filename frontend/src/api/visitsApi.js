import { API_URL } from './config.js';

// Counts this visit and returns { thisMonth }.
export async function recordVisit() {
  const response = await fetch(`${API_URL}/api/visits`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Visit request failed: ${response.status}`);
  }
  return response.json();
}

// Only reads { thisMonth }, without counting a visit.
export async function fetchVisits() {
  const response = await fetch(`${API_URL}/api/visits`);
  if (!response.ok) {
    throw new Error(`Visits request failed: ${response.status}`);
  }
  return response.json();
}
