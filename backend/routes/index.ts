import express from "express";
const router = express.Router();

router.use("/user", require("./user"));

export default router;
