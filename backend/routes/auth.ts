import express from "express";
const router = express.Router();
import authController from "@controllers/auth.controller";

router.post("/register", authController.register);

module.exports = router;
