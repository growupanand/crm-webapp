import express from "express";
const router = express.Router();
import baseMiddleware from "@middlewares/base.middleware";

router.use("/auth", baseMiddleware, require("./auth"));

export default router;
