import mongoose from 'mongoose';

// Keep file summaries for 7 days, then MongoDB deletes them automatically.
const RETENTION_SECONDS = 7 * 24 * 60 * 60;

// Summary of one 15-minute GDELT file (one row in our "notebook").
// Daily values are built by summing these rows.
const newsFileSummarySchema = new mongoose.Schema({
  signal: { type: String, required: true },
  fileTime: { type: Date, required: true },
  weightedSum: { type: Number, required: true },
  mentions: { type: Number, required: true, min: 0 },
});

newsFileSummarySchema.index({ signal: 1, fileTime: 1 }, { unique: true });
// TTL index: deletes a summary when it is older than RETENTION_SECONDS.
newsFileSummarySchema.index({ fileTime: 1 }, { expireAfterSeconds: RETENTION_SECONDS });

export default mongoose.model('NewsFileSummary', newsFileSummarySchema);
