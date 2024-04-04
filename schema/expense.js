
//expenseModel.js
import mongoose from "mongoose";

const expensesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
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
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});


export const Expense =mongoose.model('Expense',expensesSchema)
