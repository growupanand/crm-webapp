import organizationModel from "@app/models/organization";
import userOrganizationModel from "@app/models/userOrganization";
import { MongooseError } from "@app/types/mongooseError";
import { Request, Response } from "express";

const {
  Types: { ObjectId },
} = require("mongoose");

/**
 * Create new organization and link current logged in user to this organization.
 */
const createOrganization = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newOrganization = new organizationModel({
    name,
    userId: req.user._id,
  });
  try {
    await newOrganization.save();
    // create user organization linking document
    const newUserOrganization = new userOrganizationModel({
      user: req.user._id,
      organization: newOrganization._id,
    });
    await newUserOrganization.save();
    return res.status(200).json({ ...newOrganization.toJSON() });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Get list of all organizations created by logged in user
 */
const getUserOrganizations = async (req: Request, res: Response) => {
  const organizations = await organizationModel.find({
    userId: req.user._id,
  });
  return res.status(200).json([...organizations]);
};

/**
 * Delete an organization
 */
const deleteOrganization = async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  try {
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
    // delete organization from database
    await organizationModel.deleteOne({
      _id: organizationId,
    });
    return res
      .status(200)
      .json({ message: "Organization deleted successfully" });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

export default { createOrganization, getUserOrganizations, deleteOrganization };
