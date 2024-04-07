
import { Notification } from "../schema/notification.js";
import { User } from "../schema/user.js";

// Get Users Notification
export async function getNotifyByUser(req) {
  return await User.findOne({ sessionToken: req.body.sessionToken }).populate(
    "notification.data"
  );
}

// Get alll Notification
export function getAllNotify() {
  return Notification.find();
}

// Delete Notification Document
export function deleteNotify(req) {
  return Notification.deleteOne({ _id: req.body.notifyId });
}

// Create Notification
export function createNotify(req) {
  return new Notification({
    notificationName: req.body.notificationName,
    message: req.body.message,
    createdBy: req.user._id,
  }).save();
}

// Get Notification
export function getNotify(req) {
  return Notification.findOne({ _id: req.body._id });
}
