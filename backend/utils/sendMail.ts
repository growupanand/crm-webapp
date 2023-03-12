import nodemailer from "nodemailer";

import dotenv from "dotenv";
import path from "path";
import hbs from "nodemailer-express-handlebars";
import { MailTemplates } from "@app/types/mailTemplates";

dotenv.config();

// ---------------NodeMailer Setup---------------------------
let isMailConfigured = false;
const isServiceBasedConfig = !!process.env.NODEMAILER_SERVICE;
const transportOption = {
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
  ...(isServiceBasedConfig
    ? { service: process.env.NODEMAILER_SERVICE }
    : {
        host: process.env.NODEMAILER_HOST,
        port: Number(process.env.NODEMAILER_PORT),
        secure: true,
      }),
};
let transporter = nodemailer.createTransport(transportOption);
console.log("Verifying Mail configuration");
transporter.verify(function (error: any) {
  if (error) {
    return console.error("Mail configuration failed", { error });
  }
  console.log("Mail configuration success");
  isMailConfigured = true;
});

// ------------------Setup mail templates--------------------

// point to the template folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./views/templates/mail"),
    defaultLayout: "",
  },
  viewPath: path.resolve("./views/templates/mail"),
};

// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));

// -------------------Utility Function--------------------------

type Props<T extends keyof MailTemplates> = {
  // Receiver mail id
  to: string;
  // Template name which will be used
  template: T;
  // Data which is required by template
  context: MailTemplates[T];
};

/**
 * Send mail
 * @param props
 * @returns
 */
const sendMail = async <T extends keyof MailTemplates>(props: Props<T>) => {
  const { to, template, context } = props;
  const mailOption = {
    from: process.env.NODEMAILER_FROM,
    to,
    subject: context.subject,
    template,
    context,
  };
  let data = null;
  try {
    if (!isMailConfigured) {
      throw new Error("Mail is not configured");
    }
    data = await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("error while sending mail", { error });
  }
  return data;
};

export { transporter, sendMail };
