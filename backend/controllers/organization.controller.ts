import organizationModel from "@app/models/organization";
import { Request, Response } from "express";
import { MongooseError } from "@app/types/mongooseError";

const {
  Types: { ObjectId },
} = require("mongoose");

/**
 * Create new organization
 * @param req
 * @param res
 */
const createOrganization = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newOrganization = new organizationModel({
    name,
    userId: req.user._id,
  });
  await newOrganization.save((saveErr, savedData) => {
    if (saveErr) {
      return res.sendMongooseErrorResponse(saveErr);
    }
    return res.status(200).json({ ...savedData.toJSON() });
  });
};

/**
 * Get list of all organizations created by user
 * @param req
 * @param res
 * @returns
 */
const getUserOrganizations = async (req: Request, res: Response) => {
  const organizations = await organizationModel.find({
    userId: req.user._id,
  });
  return res.status(200).json({
    ...organizations,
  });
};

/**
 * Delete an organization
 * @param req
 * @param res
 * @returns
 */
const deleteOrganization = async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  const organization = await organizationModel.findOne({
    _id: ObjectId(organizationId),
  });
  // check if organization exist in database
  if (!organization)
    return res.sendCustomErrorMessage("Organization not found");
  // check if organization is created by current logged in user
  if (String(organization.userId) !== String(req.user._id))
    return res.sendCustomErrorMessage(
      "You are not authorized to delete this organization"
    );
  // delete orgniazation from database
  await organization.delete((error) => {
    if (error) return res.sendMongooseErrorResponse(error);
    return res
      .status(200)
      .json({ message: "Organization deleted successfully" });
  });
};

export default { createOrganization, getUserOrganizations, deleteOrganization };
