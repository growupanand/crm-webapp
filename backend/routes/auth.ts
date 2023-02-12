import express from "express";
const router = express.Router();
import authController from "@controllers/auth.controller";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.post("/getAccessToken", authController.getAccessToken);
router.get("/verifyEmail/:token", authController.verifyEmailToken);
router.post("/resetPassword", authController.resetPassword);

module.exports = router;
