import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import hbs from "nodemailer-express-handlebars";

dotenv.config();

// ---------------NodeMailer Setup---------------------------
let isMailConfigured = false;
const NODEMAILER_FROM = process.env.NODEMAILER_FROM;
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

export { transporter, isMailConfigured, NODEMAILER_FROM };
