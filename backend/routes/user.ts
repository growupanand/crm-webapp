import express from "express";
const router = express.Router();
import userController from "@controllers/user.controller";

router.get("/:userId", userController.getUser);

module.exports = router;
