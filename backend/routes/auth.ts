import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  getAccessToken,
  verifyEmailToken,
  resetPassword,
} from "@controllers/auth.controller";

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/getAccessToken", getAccessToken);
router.get("/verifyEmail/:token", verifyEmailToken);
router.post("/resetPassword", resetPassword);

module.exports = router;
