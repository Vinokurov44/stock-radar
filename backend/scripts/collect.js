import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { collectSignals } from '../src/jobs/collectSignals.js';

// One collection run: connect, collect all signals, disconnect, exit.
// Used by GitHub Actions every hour, and can be run by hand: npm run collect
try {
  await connectDB(process.env.MONGODB_URI);
  await collectSignals();
  console.log('Collection finished');
} catch (error) {
  console.error('Collection failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
