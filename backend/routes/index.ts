import express from "express";
const router = express.Router();

router.use("/user", require("./user"));
router.use("/organizations", require("./organization"));

export default router;
