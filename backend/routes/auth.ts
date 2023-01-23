import express from "express";
const router = express.Router();
import AuthController from "@controllers/auth.controller";

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.delete("/logout", AuthController.logout);
router.post("/getAccessToken", AuthController.getAccessToken);

module.exports = router;
