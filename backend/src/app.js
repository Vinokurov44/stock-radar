import express from 'express';
import cors from 'cors';
import signalRoutes from './routes/signalRoutes.js';
import radarRoutes from './routes/radarRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

const app = express();
app.set('trust proxy', 1);

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/signals', signalRoutes);
app.use('/api/radar', radarRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/feedback', feedbackRoutes);

// Unknown API address -> JSON 404 instead of an HTML page.
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Any error thrown in a route ends up here (Express 5 forwards async errors automatically).
// The details go to the server log; the client gets a short message without internals.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
