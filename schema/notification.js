
import mongoose from "mongoose";
import { ObjectId } from "bson";

const notificationSchema = new mongoose.Schema({
  notificationName: {
    type: String,
    trim: true,
    required: true,
    minLength: [1, "Name should have at least 1 characters"],
    maxLength: [200, "Name should have at most 200 characters"],
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minLength: [1, "Name should have at least 1 characters"],
    maxLength: [500, "Name should have at most 500 characters"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdBy: {
    type: ObjectId,
    trim: true,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
