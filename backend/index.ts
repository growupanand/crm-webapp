import express from "express";
const app = express();
import router from "./routes";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3001;

app.use("/api", express.json(), router);

// start server
console.log(`Starting Backend Server: http://localhost:${port}`)
app.listen(port);
console.log('%cSuccess', 'color: green');

// Connect Database
const databaseURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm-webapp';
mongoose.connect(databaseURI);
console.log(`Connecting Database: ${databaseURI}`)
const db = mongoose.connection;
db.on("error", (error) =>
  console.error("Error while connecting database", error)
);
db.once("open", () =>
  console.log("Success")
);
