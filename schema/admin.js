
import mongoose from "mongoose";
import { ObjectId } from "bson";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  activationToken: {
    type: String,
    trim: true,
  },
  sessionToken: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    default: "Admin",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  activity: [
    {
      type: String,
      trim: true,
    },
  ],
  account: {
    type: String,
    required: true,
    default: "inactive",
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
