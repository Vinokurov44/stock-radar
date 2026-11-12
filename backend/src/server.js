import app from './app.js';
import { connectDB } from './config/db.js';
import { collectSignals } from './jobs/collectSignals.js';

const PORT = process.env.PORT || 5000;
const COLLECT_INTERVAL_MS = 60 * 60 * 1000;

try {
  await connectDB(process.env.MONGODB_URI);
  collectSignals();
  setInterval(collectSignals, COLLECT_INTERVAL_MS);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
