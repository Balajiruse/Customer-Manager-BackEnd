
import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    req.user.first_name = req.body.first_name;
    req.user.last_name = req.body.last_name;
    req.user.phoneNumber = req.body.phoneNumber;
    await req.user.save();

    return res.status(200).json({
      message: "Profile has been updated",
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

export const profileRouter = router;
