
import express from "express";
import {
  getAllServices,
  getAllTicketData,
  getAllUser,
  getAllUserTicket,
} from "../Controllers/alldata.js";

const router = express.Router();

router.post("/alldata", async (req, res) => {
  try {
    // All the services
    const AllSer = await getAllServices();
    if (!AllSer || AllSer.length < 1) {
      AllSer = [];
    }

    if (req.user.role === "User") {
      // All the tickets for users
      let allUserTic = await getAllUserTicket(req);

      // Resolved tickets for user
      let ResolvedTic = [];

      if (!allUserTic || allUserTic.length < 1) {
        allUserTic = [];
      } else {
        // updating resolved tickets
        ResolvedTic = allUserTic.filter((data) => {
          if (data.resolvedBy) return true;
          return false;
        });
      }

      return res.status(201).json({
        acknowledged: true,
        data: {
          totalTickets: allUserTic.length,
          resolvedTicket: ResolvedTic.length,
          totalService: AllSer.length,
          currSer: req.user.services.length || 0,
        },
      });
    }

    if (req.user.role !== "User") {
      // Get All the user
      const allUser = await getAllUser();

      // get All ticket
      let allTic = await getAllTicketData();
      let resolvedTic = [];

      if (!allTic || allTic.length < 1) {
        allTic = [];
      } else {
        // updating resolved tickets
        resolvedTic = allTic.filter((data) => {
          if (data.resolvedBy) return true;
          return false;
        });
      }

      return res.status(201).json({
        acknowledged: true,
        data: {
          totalTickets: allTic.length,
          resolvedTicket: resolvedTic.length,
          totalUser: allUser.length,
          totalService: AllSer.length,
        },
      });
    }

    return res
      .status(400)
      .json({ acknowledged: false, error: "user Not found" });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
});

export const dataRouter = router;
