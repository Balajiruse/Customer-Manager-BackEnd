import express from "express";
import { genearateToken } from "../auth/auth.js";
import { sentMail } from "../Helper/forgot.js";
const router = express.Router();

// sent password reset email flow
router.post("/", async (req, res) => {
  try {
    // generate token
    const token = genearateToken(req.user._id);

    // sent mail with token
    const sentedMail = await sentMail(
      req.body.email,
      req.user._id,
      token,
      req.body.link
    );

    if (!sentedMail)
      return res
        .status(400)
        .json({ error: "error sending mail", acknowledged: false });

    // save token in Database
    req.user.token = token;
    await req.user.save();

    return res.status(200).json({
      message: "Email Sent Successfully",
      valid: "Email is valid for 15 mintues",
      acknowledged: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
});

export const forgotRouter = router;