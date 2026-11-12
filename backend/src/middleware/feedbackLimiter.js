import { rateLimit } from 'express-rate-limit';

const ONE_HOUR_MS = 60 * 60 * 1000;

export const feedbackLimiter = rateLimit({
  windowMs: ONE_HOUR_MS,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later' },
});
