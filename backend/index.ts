import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

console.log(`
=============================================
Starting backend, please wait...`);

/**
 * <--------------Validate all required environment variables are set-------------
 */
dotenv.config();
import { HOST, NODE_ENV, PORT } from "@app/constants";
console.log({ HOST, NODE_ENV, PORT });

// Set default environment variables for development purpose
if (NODE_ENV === "local") {
  process.env.MONGO_URI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crm-webapp";
}

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
  () => {
    console.log("%cDatabase connected", "color: green");
    seedDefaultRoles();
  },
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
import rateLimiter from "@app/middleware/rateLimiter.middleware";
import { seedDefaultRoles } from "./seeds/defaultRoles";

const app = express();

// this will allow api request from any url
app.use(cors());

app.use(
  "/api/auth",
  express.json(),
  rateLimiter, // limit each IP to 2 requests per 5 seconds
  baseMiddleware,
  require("@routes/auth")
);
app.use("/api", express.json(), baseMiddleware, authMiddleware, routes);
app.listen(PORT, () =>
  console.log(`%cServer started successfully ${HOST}:${PORT}`, "color: green")
);
