
import { Ticket } from "../schema/ticket.js";

// get all tickets
export function getAllTickets() {
  return Ticket.find();
}

// get only user ticket
export function getUserTickets(req) {
  return Ticket.find({ createdBy: req.user._id });
}

// get ticket by ticket ID
export function getTicketById(req) {
  return Ticket.findOne({ _id: req.body.ticketId });
}

// Delete Ticket
export function deleteTicket(req) {
  return Ticket.deleteOne({ _id: req.body.ticketId });
}

// create new Ticket
export function createNewTicket(req) {
  return new Ticket({
    ...req.body.ticData,
    createdBy: req.user._id,
  }).save();
}
