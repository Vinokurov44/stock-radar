import { getVixSnapshots } from '../signals/vixSignal.js';
import { getFsiSnapshots } from '../signals/fsiSignal.js';
import { getFearGreedsnapshot } from '../signals/fearGreedSignal.js';
import { saveSnapshot } from '../services/signalService.js';
import { getWorldTensionSnapshots } from '../signals/worldTensionSignal.js';
import { getRateShockSnapshots } from '../signals/rateShockSignal.js';
import { getCpSpreadSnapshots } from '../signals/cpSpreadSignal.js';

const SIGNALS = [
  getVixSnapshots,
  getFsiSnapshots,
  getFearGreedsnapshot,
  getWorldTensionSnapshots,
  getRateShockSnapshots,
  getCpSpreadSnapshots,
];
const BACKFILL_DAYS = 10;

// Collects all signals and saves their daily snapshots for the last BACKFILL_DAYS days.
// Each signal runs on its own: if one fails, the error is logged and the rest continue.
// Saving is an upsert by signal + date, so running it again never creates duplicates.
export async function collectSignals() {
  for (const getSnapshots of SIGNALS) {
    try {
      const snapshots = await getSnapshots(BACKFILL_DAYS);

      for (const snapshot of snapshots) {
        await saveSnapshot(snapshot);
      }

      const latest = snapshots.at(-1);
      console.log(`Saved ${snapshots.length} ${latest?.signal} snapshots, latest ${latest?.date}`);
    } catch (error) {
      console.error('Signal collection failed:', error.message);
    }
  }
}
