import organizationModel from "@app/models/organization";
import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";

/** This will pass organization object from Id found in url */
export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { organizationId } = req.params;
  // check if organization id is provided and is a valid mongoose object id
  if (!organizationId || !isValidObjectId(organizationId)) {
    return res.sendCustomErrorMessage("Invalid Organization Id", 400);
  }
  // get organization
  const organization = await organizationModel.findOne({ _id: organizationId });
  if (!organization) {
    return res.sendCustomErrorMessage("Organization not found", 400);
  }
  // pass organization in req object
  req.organization = organization;
  next();
}
