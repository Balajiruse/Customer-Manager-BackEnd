
import express from "express";
import bcrypt from "bcrypt";
import { sendActivationMail } from "../Helper/Acivater.js";
import { genearateActiveToken, genearateSessionToken } from "../auth/auth.js";
import {
  getAdmin,
  getAdminByActToken,
  getAdminBySessionToken,
  getAdminByToken,
  newAdmin,
} from "../Controllers/admin.js";
import { ticketRouter } from "./ticketrouter.js";
import { forgotRouter } from "./forgotroute.js";
import { updateRouter } from "./updatePassword.js";
import { notificationRouter } from "./notificationrouter.js";
import { profileRouter } from "./profileupdate.js";
import { serviceRouter } from "./servicerouter.js";
import { dataRouter } from "./dataroute.js";

const router = express.Router();

// middleware function for forgot password
const checkAdmin = async (req, res, next) => {
  try {
    // admin exist by email
    const user = await getAdmin(req);
    if (!user)
      return res
        .status(404)
        .json({ error: "user not found", acknowledged: false });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
};

// check user by token for updating password
const checkUserByToken = async (req, res, next) => {
  try {
    const { id, token } = req.params;

    // user exist
    const user = await getAdminByToken(req);

    if (!user)
      return res
        .status(404)
        .json({ error: "user not found", acknowledged: false });
    req.user = user;
    req.token = token;
    req.id = id;
    next();
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
};

// check user by Session Token for logout and to use App features
const checkAdminBySessionToken = async (req, res, next) => {
  try {
    // user exist
    const user = await getAdminBySessionToken(req);
    if (!user)
      return res
        .status(404)
        .json({ error: "user not found", acknowledged: false });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
};

// to send activation email
async function activationMail(email) {
  const actToken = genearateActiveToken(email);

  const activeMail = await sendActivationMail(email, actToken, "admin");

  if (!activeMail)
    return {
      acknowledged: false,
    };

  return {
    acknowledged: true,
    actToken,
  };
}

// Signup
router.post("/signup", async (req, res) => {
  try {
    // check user
    const checkUser = await getAdmin(req);
    if (checkUser) return res.status(400).json({ error: "user already exist" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // saving new user
    const user = {
      ...req.body,
      password: hashedPassword,
    };

    //Send activation mail
    const actMailSent = await activationMail(user.email);
    if (!actMailSent.acknowledged)
      return res.status(400).json({
        error: "error sending confirmation mail Please check the mail address",
        acknowledged: false,
      });

    // save the new user after confirmation email
    const savedUser = await newAdmin(user);
    savedUser.activationToken = actMailSent.actToken;
    await savedUser.save();

    return res.status(201).json({
      message:
        "Confirmation email is send to your email Address go to Login page",
      acknowledged: true,
      id: savedUser._id,
      email: "Confirmation email is send to your email Address",
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    // user exist
    const user = await getAdmin(req);
    if (!user)
      return res
        .status(404)
        .json({ error: "user not found", acknowledged: false });

    //validating password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    console.log(req.body);

    if (!validPassword)
      return res
        .status(404)
        .json({ error: "Incorrect password", acknowledged: false });
    if (user.account === "inactive")
      return res.status(404).json({
        error: "verification not completed, verify your account to login",
        active: true,
        acknowledged: false,
      });

    // generate session token
    const sesToken = genearateSessionToken(user._id);
    if (!sesToken)
      res.status(404).json({ error: "user not found", acknowledged: false });

    user.sessionToken = sesToken;
    const now = Date.now();
    console.log(req.body);
    user.activity = [...user.activity, now];

    await user.save();

    res.status(200).json({
      message: "logged in successfully",
      sessionToken: sesToken,
      acknowledged: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Resend Activation email by email
router.post("/resendemail", async (req, res) => {
  try {
    // check user
    const checkUser = await getAdmin(req);

    if (!checkUser)
      return res
        .status(400)
        .json({ error: "user not found", acknowledged: false });

    // Send activation mail
    const actMailSent = await activationMail(checkUser.email);
    if (!actMailSent.acknowledged)
      return res.status(400).json({
        error:
          "error sending confirmation mail Please check the entered mail address",
        acknowledged: false,
      });

    checkUser.activationToken = actMailSent.actToken;
    await checkUser.save();

    res.status(201).json({
      message: "verification email is send to your email Address",
      acknowledged: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Activate account
router.get("/signup/activate/:token", async (req, res) => {
  try {
    // user exist
    const user = await getAdminByActToken(req);
    if (!user) return res.status(404).json({ error: "user not found" });
    if (user.account === "active") {
      user.activationToken = "";
      await user.save();
      return res.status(400).send("Your account is activated already");
    }

    // change account status to active
    user.account = "active";
    user.activationToken = "";
    await user.save();

    res.status(201).send("Your account has been activated");
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// logout
router.get("/logout", async (req, res) => {
  try {
    // check user
    const checkUser = await getAdminBySessionToken(req);

    if (!checkUser)
      return res
        .status(400)
        .json({ error: "user not found", acknowledged: false });

    // removing the session token
    checkUser.sessionToken = "";
    await checkUser.save();

    res.status(201).json({
      message: "session token removed",
      acknowledged: true,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// forgot password
router.use("/forgot", checkAdmin, forgotRouter);

// update password
router.use("/update/:id/:token", checkUserByToken, updateRouter);

// tickets
router.use("/ticket", checkAdminBySessionToken, ticketRouter);

// Notification
router.use("/notify", checkAdminBySessionToken, notificationRouter);

// Update Profile
router.use("/profile/update", checkAdminBySessionToken, profileRouter);

// Service
router.use("/service", checkAdminBySessionToken, serviceRouter);

// Check user
router.post("/check", checkAdminBySessionToken, async (req, res) => {
  try {
    res.status(201).json({ acknowledged: true, user: req.user });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Get Data
router.use("/data", checkAdminBySessionToken, dataRouter);

export const adminRouter = router;
