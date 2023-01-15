import express from "express";
const router = express.Router();
import UserController from "@controllers/user.controller";

router.get("/:userId", UserController.getUser);

module.exports = router;
