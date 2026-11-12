import { Feedback } from '../models/Feedback.js';

export async function createFeedback({ firstName, lastName, message, type }) {
  return Feedback.create({ firstName, lastName, message, type });
}
