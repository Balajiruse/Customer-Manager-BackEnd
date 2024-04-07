
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

// middleware verify user
const verifyUser = async (req, res, next) => {
  try {
    // JWT verify
    const jwtVerify = jwt.verify(req.token, process.env.SECRET_KEY);
    if (!jwtVerify)
      res
        .status(400)
        .json({ error: "link invalid or expired", acknowledged: false });

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(500).json({
        error: "Token expired",
        message: "create another token for password reset",
      });
    } else {
      res.status(500).json({ error: "Internal Server Error", message: err });
    }
  }
};

// To reset page
router.get("/", verifyUser, async (req, res) => {
  try {
    return res.status(200).json({ data: "verified user", acknowledged: true });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err });
  }
});

// update new password
router.patch("/", verifyUser, async (req, res) => {
  try {
    // check for empty data
    if (req.body.newPassword != req.body.confirmNewPassword) {
      return res
        .status(400)
        .json({ error: "Password does not match", acknowledged: false });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    // saving updated password
    req.user.token = "";
    req.user.password = hashedPassword;

    await req.user.save();

    return res
      .status(200)
      .json({ message: "New password updated", acknowledged: true });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: err,
      acknowledged: false,
    });
  }
});

export const updateRouter = router;
