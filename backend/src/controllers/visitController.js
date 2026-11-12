import { recordVisit, getVisitsThisMonth } from '../services/visitService.js';

// POST /api/visits — count a new visit and return the monthly total.
export async function postVisit(req, res) {
  await recordVisit();
  const thisMonth = await getVisitsThisMonth();
  res.status(201).json({ thisMonth });
}

// GET /api/visits — only read the monthly total.
export async function getVisits(req, res) {
  const thisMonth = await getVisitsThisMonth();
  res.json({ thisMonth });
}
