import { getRadar } from '../services/radarService.js';

export async function getRadarScore(req, res) {
  const radar = await getRadar();
  res.json(radar);
}
