import organizationMiddleware from "@app/middleware/organization.middleware";
import express from "express";
const router = express.Router();

router.use("/user", require("./user"));
router.use("/organizations", require("./organization"));
router.use(
  "/organizations/:organizationId/customers",
  organizationMiddleware,
  require("./customer")
);
router.use(
  "/organizations/:organizationId/insuranceCompanies",
  organizationMiddleware,
  require("./insuranceCompany")
);

export default router;
