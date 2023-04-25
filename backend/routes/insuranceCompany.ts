import insuranceCompanyController from "@app/controllers/insuranceCompany.controller";
import express from "express";
const router = express.Router();

router.get("/", insuranceCompanyController.getAllInsuranceCompanies);
router.get(
  "/:insuranceCompanyId",
  insuranceCompanyController.getInsuranceCompany
);
router.post("/", insuranceCompanyController.createInsuranceCompany);
router.patch(
  "/:insuranceCompanyId",
  insuranceCompanyController.updateInsuranceCompany
);

router.delete(
  "/:insuranceCompanyId",
  insuranceCompanyController.deleteInsuranceCompany
);

module.exports = router;
