import express from "express";
const router = express.Router();
import authController from "@controllers/auth.controller";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.post("/getAccessToken", authController.getAccessToken);

module.exports = router;
