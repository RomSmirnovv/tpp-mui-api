import mongoose from 'mongoose';

const { Schema } = mongoose;

const refreshSessionSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    token_hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    finger_print: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

export const RefreshSession = mongoose.model('RefreshSession', refreshSessionSchema);
