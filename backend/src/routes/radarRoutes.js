import express from 'express';

import { getRadarScore } from '../controllers/radarController.js';

const radarRoutes = express.Router();
radarRoutes.get('/', getRadarScore);

export default radarRoutes;
