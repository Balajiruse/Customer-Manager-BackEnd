
import { User } from "../schema/user.js";

// find one user by email
export function getUser(req) {
  return User.findOne({ email: req.body.email });
}

// find all user by email
export function getAllUser() {
  return User.find();
}

// add new user
export function newUser(user) {
  return new User(user).save();
}

// get user by token
export async function getUserByToken(req) {
  return User.findOne({ token: req.params.token });
}

// activate account by activation token
export function getUserByActToken(req) {
  return User.findOne({ activationToken: req.params.token });
}

// get user by Session Token with notification populate
export async function getUserBySessionToken(req) {
  return User.findOne({ sessionToken: req.body.sessionToken }).populate(
    "notification.data"
  );
}

export async function getUserServices(req) {
  return User.findOne({ sessionToken: req.body.sessionToken }).populate(
    "services"
  );
}
