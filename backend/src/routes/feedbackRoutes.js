import { Router } from 'express';
import { postFeedback } from '../controllers/feedbackController.js';
import { feedbackLimiter } from '../middleware/feedbackLimiter.js';

const router = Router();

router.post('/', feedbackLimiter, postFeedback);

export default router;
