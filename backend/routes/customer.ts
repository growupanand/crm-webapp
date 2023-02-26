import customerController from "@app/controllers/customer.controller";
import express from "express";
const router = express.Router();

router.get("/", customerController.getAllCustomers);
router.get("/:customerId", customerController.getCustomer);
router.post("/", customerController.createCustomer);
router.delete("/:customerId", customerController.deleteCustomer);

module.exports = router;
