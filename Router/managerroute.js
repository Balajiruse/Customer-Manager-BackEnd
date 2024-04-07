
import express from "express";
import bcrypt from "bcrypt";
import { sendActivationMail } from "../Helper/Acivater.js";
import { genearateActiveToken, genearateSessionToken } from "../auth/auth.js";
import {
  getManager,
  newManager,
  getManagerByToken,
  getManagerBySessionToken,
  getManagerByActToken,
} from "../Controllers/manager.js";
import { forgotRouter } from "./forgotroute.js";
import { updateRouter } from "./updatePassword.js";
import { ticketRouter } from "./ticketrouter.js";
import { notificationRouter } from "./notificationrouter.js";
import { profileRouter } from "./profileupdate.js";
import { serviceRouter } from "./servicerouter.js";
import { dataRouter } from "./dataroute.js";

const router = express.Router();

// Middleware function for forgot password
const checkManager = async (req, res, next) => {
  try {
    // Manager exist by email
    const user = await getManager(req);
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

// Check user by token for update password
const checkManagerByToken = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    // user exist
    const user = await getManagerByToken(req);

    if (!user) return res.status(404).json({ error: "user not found" });
    req.user = user;
    req.token = token;
    req.id = id;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
};

// Check user by Session Token for logout and to use App features
const checkManagerBySessionToken = async (req, res, next) => {
  try {
    // user exist
    const user = await getManagerBySessionToken(req);
    if (!user) return res.status(404).json({ error: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
};

// To send activation email
async function activationMail(email) {
  const actToken = genearateActiveToken(email);

  const activeMail = await sendActivationMail(email, actToken, "manager");

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
    // check manager
    const checkUser = await getManager(req);
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
    const savedUser = await newManager(user);
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
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // user exist
    const user = await getManager(req);
    if (!user)
      return res
        .status(404)
        .json({ error: "user not found", acknowledged: false });

    //validating password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

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
    const checkUser = await getManager(req);

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
    const user = await getManagerByActToken(req);

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

// Logout
router.get("/logout", async (req, res) => {
  try {
    // check user
    const checkUser = await getManagerBySessionToken(req);

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

// Forgot password
router.use("/forgot", checkManager, forgotRouter);

// Update password
router.use("/update/:id/:token", checkManagerByToken, updateRouter);

// Tickets
router.use("/ticket", checkManagerBySessionToken, ticketRouter);

// Notification
router.use("/notify", checkManagerBySessionToken, notificationRouter);

// Update Profile
router.use("/profile/update", checkManagerBySessionToken, profileRouter);

// Service
router.use("/service", checkManagerBySessionToken, serviceRouter);

// Check user
router.post("/check", checkManagerBySessionToken, async (req, res) => {
  try {
    res.status(201).json({ acknowledged: true, user: req.user });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// Get Data
router.use("/data", checkManagerBySessionToken, dataRouter);

export const managerRouter = router;
