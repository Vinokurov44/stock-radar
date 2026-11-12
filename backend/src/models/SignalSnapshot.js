import mongoose from 'mongoose';
export const SIGNAL_NAMES = ['vix', 'fsi', 'fng', 'world_tension', 'rate_shock', 'cp_spread'];

const signalSnapshotSchema = new mongoose.Schema(
  {
    signal: { type: String, required: true, enum: SIGNAL_NAMES },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    value: { type: Number, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    open: Number,
    high: Number,
    low: Number,
  },
  { timestamps: true },
);

signalSnapshotSchema.index({ signal: 1, date: 1 }, { unique: true });

export default mongoose.model('SignalSnapshot', signalSnapshotSchema);
