import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();
let isMailConfigured = false;
let transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

console.log("Verifying server mail configuration");
transporter.verify(function (error) {
  if (error) {
    return console.error("Server Mail configuration failed", { error });
  }
  console.log("server Mail configuration success");
  isMailConfigured = true;
});

/**
 * This middleware will add nodemailer's sendMail method, which will be used to send any mail
 * @param req
 * @param res
 * @param next
 * @returns
 */
export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!isMailConfigured)
    return res.sendCustomErrorMessage("Server mail not setup", 500);

  res.transporter = transporter;
  next();
}
