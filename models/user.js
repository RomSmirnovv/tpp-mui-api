import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    patronymic: {
      type: String,
      required: false,
      default: '',
      trim: true,
    },
    birthDate: {
      type: String,
      required: false,
      default: '',
    },
    role: {
      type: Number,
      required: true,
      enum: [2, 3],
      default: 3,
    },
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

userSchema.index({ login: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
