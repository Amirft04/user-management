import config from "../configs/configs"; // Adjust the path to your config file
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import Axios from "axios";
import nodemailer from "nodemailer";

export const sendSMSIR = async (text: string, to: string) => {
  const url = "";
  const username = "";
  const password = "";
  const number = "";
  let state = await Axios.post(url, {
    username: username,
    password: password,
    from: number,
    to: to,
    text: text,
  });
};

export const sendEmail = async (
  text: string,
  to: string,
  subject: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    pool: true,
    host: "",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: "",
      pass: "",
    },
  });

  const mailOptions = {
    from: "",
    to: to,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // Handle error
    } else {
      // Email sent successfully
    }
  });
};

export const getToken = (
  userId: Types.ObjectId,
  userRole: string,
  PhoneNumber: string
) => {
  let payload = {
    id: userId,
    userRole,
    PhoneNumber: PhoneNumber,
  };
  let token = jwt.sign(payload, config.secret, {
    expiresIn: "1d",
  });
  return token;
};
