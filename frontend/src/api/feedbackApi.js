import { API_URL } from './config.js';

export async function sendFeedback(feedback) {
  const response = await fetch(`${API_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error ?? 'Request failed');
    error.status = response.status;
    error.fields = data.fields ?? [];
    throw error;
  }

  return data;
}
