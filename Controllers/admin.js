
import { Admin } from "../schema/admin.js";

// find one user by email for login and forgot password
export function getAdmin(req) {
  return Admin.findOne({ email: req.body.email });
}

// add new user
export function newAdmin(user) {
  return new Admin(user).save();
}

// get Admin by token for update password
export async function getAdminByToken(req) {
  return Admin.findOne({ token: req.params.token });
}

// activate account by activation token
export function getAdminByActToken(req) {
  return Admin.findOne({ activationToken: req.params.token });
}

// get Admin by Session Token for to use all app features and logout
export async function getAdminBySessionToken(req) {
  return Admin.findOne({ sessionToken: req.body.sessionToken });
}
