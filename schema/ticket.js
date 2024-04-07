
import mongoose from "mongoose";
import { ObjectId } from "bson";
import ShortUniqueId from "short-unique-id";

// random String Generator
const randomStr = new ShortUniqueId();

const ticketSchema = new mongoose.Schema({
  ticketName: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Name should have at least 1 characters"],
    maxLength: [200, "Name should have at most 200 characters"],
  },
  ticketMessage: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Name should have at least 1 characters"],
    maxLength: [500, "Name should have at most 500 characters"],
  },
  ticketNumber: {
    type: String,
    required: true,
    trim: true,
    default: () => randomStr.rnd(),
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
  createdBy: {
    type: ObjectId,
    required: true,
    ref: "User",
    trim: true,
  },
  resolvedBy: {
    type: ObjectId,
    ref: "Manager",
    trim: true,
  },
  resolveComment: {
    type: String,
    trim: true,
    maxLength: [150, "Name should have at most 150 characters"],
  },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);
