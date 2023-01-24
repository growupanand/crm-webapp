import organizationModel from "@app/models/organization";
import { Request, Response } from "express";
import { MongooseError } from "@app/types/mongooseError";

const {
  Types: { ObjectId },
} = require("mongoose");

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

const getUserOrganizations = async (req: Request, res: Response) => {
  const organizations = await organizationModel.find({
    userId: req.user._id,
  });
  return res.status(200).json({
    ...organizations,
  });
};

const deleteOrganization = async (req: Request, res: Response) => {
  const { organizationId } = req.params;
  try {
    await organizationModel.deleteOne({
      _id: ObjectId(organizationId),
    });
    return res
      .status(200)
      .json({ message: "Organization deleted successfully" });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

export default { createOrganization, getUserOrganizations, deleteOrganization };
