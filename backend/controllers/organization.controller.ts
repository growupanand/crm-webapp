import { BASE_URL } from "@app/constants";
import organizationModel from "@app/models/organization";
import userOrganizationModel from "@app/models/userOrganization";
import userOrganizationInvitationModel from "@app/models/userOrganizationInvitation";
import { MongooseError } from "@app/types/mongooseError";
import { generateOrganizationInvitationToken, sendMail } from "@app/utils";
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

/**
 * This function sends an invitation to join an organization to a specified email address and saves the
 * invitation information in the database.
 */
const sendInvitation = async (req: Request, res: Response) => {
  let newInvitation = {};
  const { user } = req;
  const { organizationId } = req.params;
  const { email } = req.body;
  try {
    // check if organization exist in database
    const organization = await organizationModel.findOne({
      _id: ObjectId(organizationId),
    });
    if (!organization)
      return res.sendCustomErrorMessage("Organization not found");

    // create token
    const tokenPayload = {
      invitedByUserId: user._id,
      invitedToEmail: email,
      organizationId: organization._id,
    };
    const token = await generateOrganizationInvitationToken(tokenPayload);

    // send invitation email
    const data = await sendMail({
      to: email,
      template: "organizationInvitation",
      context: {
        subject: `Invitation to Join ${organization.name}`,
        organizationName: organization.name,
        invitedByUserName: user.name,
        invitedByUserEmail: user.email,
        invitedToEmail: email,
        link: `${BASE_URL}api/organizations/invitations/accept?token=${token}/`,
      },
    });

    // if mail not sent then don't make any sense to save token in DB
    if (!data) throw new Error("unable to send mail");

    // check if invitation of this email and organization already exist in DB
    const existInvitation = await userOrganizationInvitationModel.findOne({
      invitedToEmail: tokenPayload.invitedToEmail,
      organizationId: tokenPayload.organizationId,
    });
    if (existInvitation) {
      // update invitedByUserId of exist invitation in DB
      await existInvitation.update({
        invitedByUserId: tokenPayload.invitedByUserId,
      });
      newInvitation = {
        ...existInvitation.toJSON(),
        invitedByUserId: tokenPayload.invitedByUserId,
      };
    } else {
      // create new invitation in DB
      const newOrganizationInvitation = new userOrganizationInvitationModel({
        ...tokenPayload,
      });
      await newOrganizationInvitation.save();
      newInvitation = newOrganizationInvitation.toJSON();
    }

    return res.status(200).json({ ...newInvitation });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

export default {
  createOrganization,
  getUserOrganizations,
  deleteOrganization,
  sendInvitation,
};
