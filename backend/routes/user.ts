import express from "express";
const router = express.Router();
import userController from "@controllers/user.controller";

router.get("/:userId", userController.getUser);
router.delete("/me", userController.deleteUser);
router.post("/resendEmailVerification", userController.resendEmailVerify);

module.exports = router;
