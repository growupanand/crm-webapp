import express from "express";
const router = express.Router();
import AuthController from "@controllers/auth.controller";

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
