
import mongoose from "mongoose";
import dotenv from "dotenv";

//dot env config
dotenv.config();


const DB = process.env.MONGO_URL;

export async function dbConnect() {
  try {
    await mongoose.connect(DB);
    console.log("DataBase Connected");
  } catch (err) {
    console.log(`DataBase Not Connected: ${err}`);
  }
}
