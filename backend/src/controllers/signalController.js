import { getLatestSnapshots } from '../services/signalService.js';

export async function getSignals(req, res) {
  const lastSnapshots = await getLatestSnapshots();
  res.json(lastSnapshots);
}
