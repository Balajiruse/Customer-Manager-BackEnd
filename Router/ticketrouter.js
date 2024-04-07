
import express from "express";
import {
  createNewTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  getUserTickets,
} from "../Controllers/ticket.js";

const router = express.Router();

// Get tickets all roles
router.post("/view", async (req, res) => {
  try {
    //check user
    if (req.user.role !== "User") {
      // get all tickets
      const allTickets = await getAllTickets();

      if (!allTickets || allTickets.length < 1)
        return res.status(404).json({
          message: "No Tickets Found",
          error: "No Tickets found",
          acknowledged: false,
        });

      return res.status(201).json({ acknowledged: true, tickets: allTickets });
    }

    if (req.user.role === "User") {
      // get only user tickets
      const userTickets = await getUserTickets(req);
      if (!userTickets || userTickets.length < 1)
        return res.status(404).json({
          error: "No tickets found",
          acknowledged: false,
        });

      return res.status(201).json({
        acknowledged: true,
        tickets: userTickets,
        message: "Tickets Found",
      });
    }

    return res.status(400).json({
      message: "No Tickets Found",
      error: "No user Role found",
      acknowledged: false,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Delete ticket -- Admin
router.delete("/delete", async (req, res) => {
  try {
    if (req.user.role === "Admin") {
      const deleteOneTicket = await deleteTicket(req);
      return res.status(201).json({
        message: "ticket deleted",
        data: deleteOneTicket,
        acknowledged: true,
      });
    }
    return res
      .status(401)
      .json({ error: "permission denied", acknowledged: false });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
});

// Create ticket -- User
router.post("/create", async (req, res) => {
  try {
    if (req.user.role === "User") {
      const newTicket = await createNewTicket(req);

      if (!newTicket)
        return res
          .status(404)
          .json({ error: "Cannot create ticket", acknowledged: false });

      return res.status(201).json({
        message: "Ticket Created",
        data: newTicket,
        acknowledged: true,
      });
    }
    return res
      .status(401)
      .json({ error: "permission denied", acknowledged: false });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Resolve ticket -- Admin and Manager
router.post("/resolve", async (req, res) => {
  try {
    if (req.user.role === "User") {
      return res.status(404).json({
        error: "Cannot Resolve ticket",
        acknowledged: false,
        message: "Permission denied",
      });
    }

    const ticket = await getTicketById(req);
    if (!ticket)
      return res
        .status(404)
        .json({ acknowledged: false, error: "No Ticket Found" });

    ticket.resolvedBy = req.user._id;
    ticket.resolvedAt = Date.now();
    ticket.resolveComment = req.body.comment || "No Comment";
    await ticket.save();

    return res
      .status(201)
      .json({ acknowledged: true, message: "Ticket Resolved", ticket });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
});

// Resolve ticket -- Admin and Manager
router.post("/resolve", async (req, res) => {
  try {
    if (req.user.role === "User") {
      return res.status(404).json({
        error: "Permission denied",
        acknowledged: false,
        m,
      });
    }
    console.log(req.body);
    const ticket = await getTicketById(req);
    if (!ticket)
      return res
        .status(404)
        .json({ acknowledged: false, error: "No Ticket Found" });

    ticket.resolvedBy = req.user._id;
    ticket.resolvedAt = new Date.now();
    ticket.resolveComment = req.body.comment || "No Comment";
    await ticket.save();

    return res
      .status(201)
      .json({ acknowledged: true, message: "Ticket Resolved" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

export const ticketRouter = router;
