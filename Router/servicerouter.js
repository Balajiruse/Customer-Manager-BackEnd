
import express from "express";
import {
  changeServices,
  createService,
  deleteService,
  getAllServices,
  getServiceCurr,
  getServiceOld,
} from "../Controllers/service.js";
import { getAllUser, getUserServices } from "../Controllers/user.js";
const router = express.Router();

// Create Service
router.post("/createservice", async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res
        .status(400)
        .json({ acknowledged: false, error: " Permission denied" });
    // create new notification
    const newService = await createService(req);
    if (!newService)
      return res.status(404).json({
        error: "Error creating a new Service",
        acknowledged: false,
      });

    return res.status(201).json({
      acknowledged: true,
      data: newService,
      message: "New Service created",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Delete Service
router.delete("/deleteservice", async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(404).json({
        error: "Permission Denied",
        acknowledged: false,
      });

    // create new notification
    const rmService = await deleteService(req);
    if (!rmService)
      return res.status(404).json({
        error: "Error creating a new Service",
        acknowledged: false,
      });

    // delete Service for All users
    const allUsers = await getAllUser();
    if (!allUsers || allUsers.length < 1)
      return res
        .status(404)
        .json({ acknowledged: true, message: "service removed" });

    for (let val of allUsers) {
      let len = val.services.length;
      if (len > 0) {
        val.services = val.services.filter((data) => {
          return data !== req.body.serviceId;
        });
      }
      await val.save();
    }

    return res
      .status(201)
      .json({ acknowledged: true, message: "service removed" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Change Service for Users
router.patch("/changeservice", async (req, res) => {
  try {
    if (req.user.role !== "User")
      return res
        .status(400)
        .json({ acknowledged: false, error: "Permission denied" });
    const changes = await changeServices(req);
    if (!changes.acknowledged)
      return res
        .status(400)
        .json({ error: changes.error, acknowledged: false });

    res.status(200).json({
      data: changes.data,
      acknowledged: true,
      message: "Service changed Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// get services
router.post("/getservices", async (req, res) => {
  try {
    // Getting all services
    const allServices = await getAllServices();
    if (req.user.role !== "User") {
      return res.status(201).json({ acknowledged: true, allServices });
    }

    const userService = await getUserServices(req);
    if (!userService || userService.length < 1)
      return res
        .status(400)
        .json({ error: "No data Found", acknowledged: false });

    res.status(200).json({
      userSer: userService.services,
      allServices,
      acknowledged: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

export const serviceRouter = router;
