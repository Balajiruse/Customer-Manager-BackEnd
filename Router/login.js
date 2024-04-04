import express from "express";
import bcrypt from "bcrypt";
import {
  NewUser,
  getuser,
  getuserbyActivatetoken,
} from "../Controllers/login/login.js";
import { Accountactivator } from "../Helper/Acivater.js";
import { GenearateActiveToken, GenearateSessionToken } from "../auth/auth.js";

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const user = await getuser(req);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Validating password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(404).json({ error: "Incorrect password" });

    //Check for account status
    if (user.account === "inactive") {
      return res
        .status(404)
        .json({
          error: "Verification not completed, verify your account to login",
          active: true,
        });
    }

    const token = GenearateSessionToken(user._id);

    if (!token)
      return res
        .status(404)
        .json({ error: "Failed to generate session token" });

    user.sessionToken = token;
    await user.save();
     const userId=user._id

    //save in cookies
    res.cookie("sessionToken", token, { httpOnly: true, secure: true });
    res.cookie("userid", user._id, { httpOnly: true, secure: true });

    res
      .status(200)
      .json({ data: "Logged in successfully", sessionToken: token ,userId});
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    // Checking whether input is present
    if (Object.keys(req.body).length <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid request, check for details" });
    }

    // Checking if user already exists
    const user = await getuser(req);
    if (user) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Password length check & Hashing
    if (req.body.password.length < 6) {
      return res
        .status(409)
        .json({ error: "Password length should be minimum 6" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    //activationtoken
    const activetoken = GenearateActiveToken(req.body.email);

    const activateUrl = `${process.env.backend}/activate/${activetoken}`;
    // New user registration
    const newUser = {
      ...req.body,
      password: hashedpassword,
      activetoken,
    };

    const save = await NewUser(newUser);
    if (!save._id) {
      return res.status(500).json({ error: "Failed Registration" });
    }

    // Sending activation email
    const activationResult = await Accountactivator(save.email, activetoken);

    // Handle the result of the activation email sending
    if (activationResult && activationResult.messageId) {
      // Returning a more comprehensive success response
      res.status(201).json({
        success: true,
        message: "Successfully registered. Activation email sent.",
        user: {
          _id: save._id,
          firstname: save.firstname,
          email: save.email,
        },
      });
    } else {
      res.status(500).json({ error: "Failed to send activation email" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

router.get("/activate/:token", async (req, res) => {
  try {
    // Get the token from the URL parameters
    const token = req.params.token;

    const user = await getuserbyActivatetoken(token);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.account === "active") {
      return res
        .status(400)
        .json({ error: "User already activated, you can enjoy the service" });
    }

    // Update user account status and clear activation token
    user.account = "active";
    user.activetoken = "";

    // Save the updated user
    await user.save();

    res.status(200).json({ data: "Account activated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

export const SigninRouter = router;