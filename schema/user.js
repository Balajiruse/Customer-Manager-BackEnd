import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstname:{
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"],
        trim: true
    },    
    account: {
        type: String,
        required: true,
        trim: true,
        default: 'inactive'
    },
    token: {
        type: String,
        trim: true
    },
    sessionToken: {
        type: String,
        trim: true
    },
    activetoken: {
        type: String,
        trim: true
    }

  })


 export const User=mongoose.model('User',userschema);