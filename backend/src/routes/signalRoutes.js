import express from 'express';
import { getSignals } from '../controllers/signalController.js';

const signalRoutes = express.Router();

signalRoutes.get('/', getSignals);

export default signalRoutes;
