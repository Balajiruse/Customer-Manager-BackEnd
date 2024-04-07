import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnect } from "./db/db.js";
import { userRouter } from "./Router/userRouter.js";
import { managerRouter } from "./Router/managerroute.js";
import { adminRouter } from "./Router/adminroute.js";

// Initializing App
const app = express();
// Initializing PORT
const PORT = process.env.PORT || 9000;
// Connecting DataBase
dbConnect();
// Config Dotenv
dotenv.config();
// Middlewares
app.use(express.json());
app.use(cors());

// App Routers
// user
app.use("/user", userRouter);

// manager
app.use("/manager", managerRouter);

// admin
app.use("/admin", adminRouter);

// Listening to App
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});