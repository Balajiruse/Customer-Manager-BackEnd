
import { Manager } from "../schema/manager.js";

// find one user by email for login and forgot password
export function getManager(req) {
  return Manager.findOne({ email: req.body.email });
}

// add new user
export function newManager(user) {
  return new Manager(user).save();
}

// get Manager by token for updating password
export async function getManagerByToken(req) {
  return Manager.findOne({ token: req.params.token });
}

// activate account by activation token
export function getManagerByActToken(req) {
  return Manager.findOne({ activationToken: req.params.token });
}

// get Manager by Session Token
export async function getManagerBySessionToken(req) {
  return Manager.findOne({ sessionToken: req.body.sessionToken });
}
