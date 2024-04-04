import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  Amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
  },
});

export const Income = mongoose.model('Income', IncomeSchema);