import express from 'express';
import { getVisits, postVisit } from '../controllers/visitController.js';

const router = express.Router();

router.get('/', getVisits);
router.post('/', postVisit);

export default router;
