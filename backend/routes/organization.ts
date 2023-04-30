import organizationController from "@app/controllers/organization.controller";
import express from "express";
const router = express.Router();

router.get("/", organizationController.getUserOrganizations);
router.post("/", organizationController.createOrganization);
router.delete("/:organizationId", organizationController.deleteOrganization);

/**
 * Invitation related routes
 */
router.post(
  "/:organizationId/invitations",
  organizationController.sendInvitation
);
router.get("/invitations/accept", organizationController.handleInvitation);
router.patch("/invitations/accept", organizationController.handleInvitation);

module.exports = router;
