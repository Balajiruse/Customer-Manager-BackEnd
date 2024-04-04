
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function Accountactivator(email,token) {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.emailapppassword
        }
    });

    //activation link
    const activationLink = token; 

    let htmlContent = {
      from: process.env.email,
      to: email,
      subject: 'Activate your account',
      html: `<h5>Hi there,</h5>
      <p>In order to complete your account creation click the link below to verify your email</p>
      <p>The link will be expired in 30 minutes</p>
      <div style="text-align: center;">
        <a href="${activationLink}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 15px;">
          Confirm Email
        </a>
      </div>`,
    };
    
    // Now you can use htmlContent to send the email using Nodemailer
    

    try {
        let res = await transport.sendMail(htmlContent);
        console.log(`Message sent: ${res.messageId}`);
        return res;
    } catch (err) {
        console.error({ error: err });
    }
}
