
import mongoose from "mongoose";
import { ObjectId } from "bson";

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Name should have at least 1 characters"],
    maxLength: [100, "Name should have at most 100 characters"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdBy: {
    type: ObjectId,
    ref: "Admin",
    trim: true,
  },
  currentUser: [
    {
      type: ObjectId,
      ref: "User",
      trim: true,
    },
  ],
  oldUser: [
    {
      type: ObjectId,
      ref: "User",
      trim: true,
    },
  ],
});

export const Service = mongoose.model("Service", serviceSchema);
