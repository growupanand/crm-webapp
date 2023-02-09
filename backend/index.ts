import express from "express";
import router from "./routes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import baseMiddleware from "@middlewares/base.middleware";
import authMiddleware from "@app/middlewares/auth.middleware";
import mailMiddleware from "./middlewares/mail.middleware";

dotenv.config();
const port = process.env.PORT || 3001;

// ---------------EXPRESS JS----------------
const app = express();
app.use(
  "/api/auth",
  express.json(),
  baseMiddleware,
  mailMiddleware,
  require("@routes/auth")
);
app.use("/api", express.json(), baseMiddleware, authMiddleware, router);
console.log(`Starting Backend Server: http://localhost:${port}`);
app.listen(port);
console.log("%cServer started successfully", "color: green");
// ===========================================>

// ---------------DATABASE------------------
const databaseURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crm-webapp";
mongoose.connect(databaseURI);
console.log(`Connecting Database: ${databaseURI}`);
const db = mongoose.connection;
db.on("error", (error) =>
  console.error("Error while connecting database", error)
);
db.once("open", () =>
  console.log("%cDatabase connected successfully", "color: green")
);
// ===========================================>
