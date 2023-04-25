import insuranceCompanyModel from "@app/models/insuranceCompany";
import { MongooseError } from "@app/types/mongooseError";
import { Request, Response } from "express";

/**
 * Creates a new insurance company and saves it to the database.
 */
const createInsuranceCompany = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newInsuranceCompany = new insuranceCompanyModel({
    name,
    organizationId: req.organization._id,
  });
  newInsuranceCompany.save((saveErr, savedData) => {
    if (saveErr) {
      return res.sendMongooseErrorResponse(saveErr);
    }
    return res.status(200).json({ ...savedData.toJSON() });
  });
};

/**
 * Get all insurance companies of an organization
 */
const getAllInsuranceCompanies = async (req: Request, res: Response) => {
  try {
    const insuranceCompanies = await insuranceCompanyModel.find({
      organizationId: req.organization._id,
    });
    return res.status(200).json(insuranceCompanies);
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Get one insurance company detail
 */
const getInsuranceCompany = async (req: Request, res: Response) => {
  const { insuranceCompanyId } = req.params;
  try {
    const insuranceCompany = await insuranceCompanyModel.findOne({
      _id: insuranceCompanyId,
      organizationId: req.organization._id,
    });
    if (!insuranceCompany) {
      return res.sendCustomErrorMessage("Insurance Company not found", 400);
    }
    return res.status(200).json(insuranceCompany);
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Delete an insurance company
 */
const deleteInsuranceCompany = async (req: Request, res: Response) => {
  const { insuranceCompanyId } = req.params;
  try {
    const insuranceCompany = await insuranceCompanyModel.findOne({
      _id: insuranceCompanyId,
      organizationId: req.organization._id,
    });
    if (!insuranceCompany) {
      return res.sendCustomErrorMessage("Insurance Company not found", 400);
    }
    await insuranceCompany.delete();
    return res
      .status(200)
      .json({ message: "Insurance Company deleted successfully" });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Update insurance company details
 */
const updateInsuranceCompany = async (req: Request, res: Response) => {
  const { insuranceCompanyId } = req.params;
  const updatedInsuranceCompanyData = req.body;
  try {
    const result = await insuranceCompanyModel.findOneAndUpdate(
      { id: insuranceCompanyId, organizationId: req.organization._id },
      {
        $set: {
          ...updatedInsuranceCompanyData,
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
  createInsuranceCompany,
  getAllInsuranceCompanies,
  getInsuranceCompany,
  deleteInsuranceCompany,
  updateInsuranceCompany,
};
