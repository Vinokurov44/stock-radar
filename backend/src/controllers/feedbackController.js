import { createFeedback } from '../services/feedbackService.js';

export async function postFeedback(req, res) {
  // Take only the fields we expect, ignore everything else (e.g. status)
  const { firstName, lastName, message, type } = req.body ?? {};

  const fields = [firstName, lastName, message, type];
  const allStrings = fields.every((field) => typeof field === 'string');

  if (!allStrings) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const feedback = await createFeedback({ firstName, lastName, message, type });
    res.status(201).json({ id: feedback._id });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const invalidFields = Object.keys(error.errors);
      return res.status(400).json({ error: 'Invalid input', fields: invalidFields });
    }
    throw error;
  }
}
