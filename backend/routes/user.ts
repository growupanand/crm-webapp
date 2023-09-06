import express from "express";
const router = express.Router();
import userController from "@controllers/user.controller";
import rateLimiter from "@app/middleware/rateLimiter.middleware";

router.get("/:userId", userController.getUser);
router.delete("/me", userController.deleteUser);
router.post("/resendEmailVerification", userController.resendEmailVerify);
router.post(
  "/change-password",
  rateLimiter, // limit each IP to 2 requests per 5 seconds
  userController.changePassword
);

module.exports = router;
