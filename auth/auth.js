
import dotenv from"dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

// reset token
export function GenearateToken(id){
    return jwt.sign({ id }, process.env.key, { expiresIn: '5m' })
}

// Activation token
export function GenearateActiveToken(email){
    return jwt.sign({ email }, process.env.key, { expiresIn: '30m' })
}

// Session token
export function GenearateSessionToken(id){
    return jwt.sign({ id }, process.env.key)
}

// verify token
export function VerifyToken(token){
    return jwt.verify(token, process.env.key)
}
