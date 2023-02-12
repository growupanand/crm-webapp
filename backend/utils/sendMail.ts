import nodemailer from "nodemailer";

import dotenv from "dotenv";

dotenv.config();
// ---------------NodeMailer Setup---------------------------
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
transporter.verify(function (error: any) {
  if (error) {
    return console.error("Server Mail configuration failed", { error });
  }
  console.log("server Mail configuration success");
  isMailConfigured = true;
});

// -----------------------Custom functions-----------------------------

const sendMailErrorHandler = (error: any) =>
  error
    ? console.error(`Unable to send mail`, {
        reason: !isMailConfigured ? "Server mail not configured" : error,
      })
    : null;

type MailOptions = {
  senderMail: string;
  subject: string;
  text: string;
};

/**
 * Use this to send mail
 * @param mailOptions `{senderMail, subject, text}`
 * @param cb callback function
 * @returns
 */
const sendMail = (mailOptions: MailOptions, cb?: any) => {
  const { senderMail, subject, text } = mailOptions;
  var mailOption = {
    from: process.env.MAIL_FROM,
    to: senderMail,
    subject,
    text,
  };
  return transporter.sendMail(mailOption, cb || sendMailErrorHandler);
};

export { transporter, sendMail };
