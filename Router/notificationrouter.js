
import express from "express";
import { ObjectId } from "bson";
import {
  createNotify,
  deleteNotify,
  getAllNotify,
  getNotify,
  getNotifyByUser,
} from "../Controllers/notification.js";
import { getAllUser } from "../Controllers/user.js";

const router = express.Router();

// Create notification
router.post("/createnotify", async (req, res) => {
  try {
    // create new notification
    const newNotify = await createNotify(req);

    if (!newNotify)
      return res.status(404).json({
        error: "Cannot create a new notification",
        acknowledged: false,
      });

    // get all users
    const users = await getAllUser();
    if (users.length > 1 || users) {
      const addNotify = { data: newNotify._id };
      for (let val of users) {
        val.notification = [...val.notification, addNotify];

        await val.save();
      }
    }

    return res.status(201).json({ acknowledged: true, data: newNotify });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
});

// Get notification for user
router.post("/usernotify", async (req, res) => {
  try {
    if (req.user.role !== "User")
      return res
        .status(404)
        .json({ error: "Permission Denied", acknowledged: false });

    // get User Notification populated
    const user = await getNotifyByUser(req);

    if (!user || user.role !== "User" || user.notification.length < 1)
      return res
        .status(404)
        .json({ error: "No notification found", acknowledged: false });

    return res
      .status(201)
      .json({ acknowledged: true, notifications: user.notification });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

router.post("/allnotify", async (req, res) => {
  try {
    // user exist
    if (req.user.role === "User")
      return res
        .status(404)
        .json({ error: "Permission denied", acknowledged: false });

    const notify = await getAllNotify();

    if (notify.length < 1)
      return res
        .status(404)
        .json({ error: "No notification found", acknowledged: false });

    return res.status(201).json({ acknowledged: true, notifications: notify });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Delete user notification
router.delete("/usernotifydelete", async (req, res) => {
  try {
    // user exist
    const user = await getNotifyByUser(req);
    if (!user || user.role !== "User" || user.notification.length < 1)
      return res
        .status(404)
        .json({ error: "No notification found", acknowledged: false });

    user.notification = user.notification.filter((val) => {
      return val.data._id.toString() !== req.body.notifyId;
    });

    await user.save();

    return res
      .status(201)
      .json({ acknowledged: true, message: "Notification is deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Delete notification
router.delete("/notifydelete", async (req, res) => {
  try {
    if (req.user.role === "User")
      return res
        .status(404)
        .json({ error: "Permission Denied", acknowledged: false });

    // user exist
    const deletedNotify = await deleteNotify(req);
    if (!deletedNotify)
      return res.status(404).json({
        error: "Unable to delete the notification",
        acknowledged: false,
      });

    return res
      .status(201)
      .json({ acknowledged: true, message: "Notification is deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Edit Notifications
router.patch("edit", async (req, res) => {
  try {
    // get Notification
    const notify = await getNotify(req);
    if (!notify)
      return res.status(404).json({
        error: "Cannot create a new notification",
        acknowledged: false,
      });

    notify.notificationName = req.body.name;
    notify.message = req.body.message;
    await notify.save();

    return res.status(201).json({ acknowledged: true, data: notify });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

export const notificationRouter = router;
