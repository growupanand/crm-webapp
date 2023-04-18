import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

console.log("Starting backend, please wait...");

/**
 * <--------------Validate all required environment variables are set-------------
 */
dotenv.config();
const requireEnvVariables = ["BACKEND_HOST", "MONGO_URI", "TOKEN_SECRET"];
requireEnvVariables.forEach((keyName) => {
  const variablesNotFound = [];
  if (process.env[keyName] === undefined) {
    variablesNotFound.push(keyName);
  }
  if (variablesNotFound.length > 0) {
    console.log(
      `Required Environment variables not found: ${variablesNotFound.join(
        ", "
      )}`
    );
    process.exit(1);
  }
});

// =============================================================================>

/**
 * <---------------------DATABASE SETUP----------------------
 */
const databaseURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crm-webapp";
mongoose.connect(databaseURI).then(
  () => console.log("%cDatabase connected", "color: green"),
  (error) =>
    console.log(
      `%cDatabase not connected. Reason: ${error.message}`,
      "color: red"
    )
);

// =============================================================================>

/**
 * <------------------EXPRESS JS SETUP -----------------------
 */
import routes from "./routes";
import baseMiddleware from "@app/middleware/base.middleware";
import authMiddleware from "@app/middleware/auth.middleware";
import { HOST, PORT } from "@app/constants";

const app = express();
app.use("/api/auth", express.json(), baseMiddleware, require("@routes/auth"));
app.use("/api", express.json(), baseMiddleware, authMiddleware, routes);
app.listen(PORT, () =>
  console.log(`%cServer started successfully ${HOST}:${PORT}`, "color: green")
);
