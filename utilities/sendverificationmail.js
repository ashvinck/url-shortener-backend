import nodemailer from 'nodemailer';
import { FrontendAPI } from '../config/api.js';

// This function takes email,userId,token
// uses nodemailer npm and gmail service to send account verification email to the user.
export const sendAccountVerificationMail = async (email, token) => {
  const link = `${FrontendAPI}/auth/verify-user/${email}/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    to: email,
    from: 'ashvinck10@gmail.com',
    text: 'Verify your URL Shortener App account',
    subject: 'Verify your URL Shortener App account',
    text: `Hello,Follow this link to verify your account for url shortener app for ${email}.
        ${link}.

        Thanks,
        Your app Admin`,
    html: `<h4>Verify your  URL Shortener App Account</h4><br>
        <p>Hello , Follow this link to verify your account for url shortener app for ${email}.</p>
        ${link}
    <p>Thanks,</p>
        <p>Your app Admin</p>
        `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    return;
  }
};
