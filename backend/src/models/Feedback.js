import mongoose from 'mongoose';

export const FEEDBACK_TYPES = ['idea', 'bug', 'data', 'other'];
export const FEEDBACK_STATUSES = ['new', 'read', 'done'];

// Whitelist: only English, Hebrew and Russian letters, space, hyphen and apostrophe
const NAME_PATTERN = /^[a-zA-Zא-תа-яА-ЯёЁ]+([ '-][a-zA-Zא-תа-яА-ЯёЁ]+)*$/;
const nameField = {
  type: String,
  required: true,
  trim: true,
  minlength: 2,
  maxlength: 50,
  match: NAME_PATTERN,
};

const feedbackSchema = new mongoose.Schema(
  {
    firstName: nameField,
    lastName: nameField,
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    type: {
      type: String,
      required: true,
      enum: FEEDBACK_TYPES,
    },
    status: {
      type: String,
      enum: FEEDBACK_STATUSES,
      default: 'new',
    },
  },
  { timestamps: true },
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
