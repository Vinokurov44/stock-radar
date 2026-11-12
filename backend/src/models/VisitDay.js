import mongoose from 'mongoose';

// One document per day: how many visits the site had on that date (UTC).
const visitDaySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    count: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

visitDaySchema.index({ date: 1 }, { unique: true });

export default mongoose.model('VisitDay', visitDaySchema);
