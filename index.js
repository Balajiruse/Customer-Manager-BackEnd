import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { client } from "./db/db.js";
import { SigninRouter } from "./Router/login.js";
import { expenseRouter } from "./Router/expense.js";
import { IncomeRouter } from "./Router/income.js";

//config for env 
dotenv.config()
// server Started 
const app=express()
const port=process.env.port;

//database Connection Check
client()

//Middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())


// application routes
app.use('/',SigninRouter)
app.use('/data',expenseRouter)
app.use('/input',IncomeRouter)




// listening Server
app.listen(port,() => {
    console.log(`Server Started in localhost:${port}`);
  })