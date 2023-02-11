import express from "express";
import router from "./routes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import baseMiddleware from "@middlewares/base.middleware";
import authMiddleware from "@app/middlewares/auth.middleware";

dotenv.config();
export const appPort = process.env.PORT || 3001;
export const appHost = process.env.BACKEND_HOST || "http://localhost";
export const baseUrl = `${appHost}:${appPort}/`;

// ---------------EXPRESS JS----------------
const app = express();
app.use("/api/auth", express.json(), baseMiddleware, require("@routes/auth"));
app.use("/api", express.json(), baseMiddleware, authMiddleware, router);
console.log(`Starting Backend Server: ${appHost}:${appPort}`);
app.listen(appPort);
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
