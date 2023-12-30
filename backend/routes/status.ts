import statusController from "@app/controllers/status.controller";
import express from "express";
const router = express.Router();

router.get("/", statusController.getStatus);

module.exports = router;
