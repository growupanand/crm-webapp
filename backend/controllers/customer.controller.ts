import customerModel from "@app/models/customer";
import { MongooseError } from "@app/types/mongooseError";
import { Request, Response } from "express";

/**
 * Create new customer
 * @param req
 * @param res
 */
const createCustomer = async (req: Request, res: Response) => {
  const { name, mobileNumber } = req.body;
  const newCustomer = new customerModel({
    name,
    mobileNumber,
    organizationId: req.organization._id,
  });
  newCustomer.save((saveErr, savedData) => {
    if (saveErr) {
      return res.sendMongooseErrorResponse(saveErr);
    }
    return res.status(200).json({ ...savedData.toJSON() });
  });
};

/**
 * Delete an customer
 * @param req
 * @param res
 */
const deleteCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const customer = await customerModel.findOne({
      _id: customerId,
      organizationId: req.organization._id,
    });
    if (!customer) {
      return res.sendCustomErrorMessage("Customer not found", 400);
    }
    await customer.delete();
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Get all customers of an organization
 * @param req
 * @param res
 * @returns
 */
const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerModel.find({
      organizationId: req.organization._id,
    });
    return res.status(200).json(customers);
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Get one customer detail
 * @param req
 * @param res
 * @returns
 */
const getCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const customer = await customerModel.findOne({
      _id: customerId,
      organizationId: req.organization._id,
    });
    if (!customer) {
      return res.sendCustomErrorMessage("Customer not found", 400);
    }
    return res.status(200).json(customer);
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Update customer details
 * @param req
 * @param res
 * @returns
 */
const updateCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const updatedCustomerData = req.body;
  try {
    const result = await customerModel.findOneAndUpdate(
      { id: customerId, organizationId: req.organization._id },
      {
        $set: {
          ...updatedCustomerData,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

export default {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
};
