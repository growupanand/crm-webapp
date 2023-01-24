import organizationController from "@app/controllers/organization.controller";
import express from "express";
const router = express.Router();

router.get("/", organizationController.getUserOrganizations);
router.post("/", organizationController.createOrganization);
router.delete("/:organizationId", organizationController.deleteOrganization);

module.exports = router;
