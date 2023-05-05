import { BASE_URL } from "@app/constants";
import organizationModel from "@app/models/organization";
import roleModel from "@app/models/role";
import tokenModel from "@app/models/token";
import userModel from "@app/models/user";
import userOrganizationModel from "@app/models/userOrganization";
import userOrganizationInvitationModel from "@app/models/userOrganizationInvitation";
import userOrganizationRoleModel from "@app/models/userOrganizationRole";
import { MongooseError } from "@app/types/mongooseError";
import { Organization } from "@app/types/organization";
import { OrganizationInvitationTokenPayload } from "@app/types/token";
import {
  generateOrganizationInvitationToken,
  sendMail,
  useToken,
} from "@app/utils";
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
      userId: req.user._id,
      organizationId: newOrganization._id,
    });
    await newUserOrganization.save();
    const ownerRole = await roleModel.findOne({ slug: "owner" });
    // create user role in organization
    const userOrganizationRole = new userOrganizationRoleModel({
      userOrganizationId: newUserOrganization._id,
      roleId: ownerRole?._id,
    });
    await userOrganizationRole.save();
    return res
      .status(200)
      .json({ ...newOrganization.toJSON(), role: ownerRole?.toJSON() });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

/**
 * Get list of all organizations where user is owner or member
 */
const getUserOrganizations = async (req: Request, res: Response) => {
  const userOrganizations = await userOrganizationModel
    .find({
      userId: req.user._id,
    })
    .populate("organizationId");
  const userOrganizationIds = userOrganizations.map((i) => i._id);
  const userOrganizationRoles = await userOrganizationRoleModel
    .find({
      userOrganizationId: { $in: userOrganizationIds },
    })
    .populate("roleId");
  const organizations = userOrganizations.map((userOrganization) => ({
    ...userOrganization.toJSON().organizationId,
    role: userOrganizationRoles
      .find(
        (i) =>
          i.userOrganizationId.toString() === userOrganization._id.toString()
      )
      ?.toJSON().roleId,
  }));
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
    // user cannot send invitation to himself
    if (user.email === email)
      throw new Error("logged in user cannot send invitation to himself");
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

const handleInvitation = async (req: Request, res: Response) => {
  const invalidTokenMessage = "invalid token";
  const token = req.query.token as string;
  try {
    if (!token || token.split(".").length !== 3)
      throw new Error(invalidTokenMessage);
    const tokenPayload = (await useToken(
      token,
      false,
      true
    )) as OrganizationInvitationTokenPayload;
    if (!tokenPayload) throw new Error(invalidTokenMessage);

    // Get invitation from DB
    const invitation = await userOrganizationInvitationModel
      .findOne({
        invitedToEmail: tokenPayload.invitedToEmail,
        organizationId: tokenPayload.organizationId,
      })
      .populate<{ organizationId: Organization }>("organizationId");
    if (!invitation) throw new Error(invalidTokenMessage);

    // invitation should be in pending status
    // (E.g. if invitation already accepted or rejected then invitation need to resend)
    if (invitation.status !== "pending")
      throw new Error(`already ${invitation.status} invitation`);

    // get organization details
    const organization = invitation.organizationId;
    if (!organization) throw new Error("organization not found");

    // get user details who send invitation
    const invitedByUser = await userModel.findOne({
      _id: tokenPayload.invitedByUserId,
    });
    if (!invitedByUser) throw new Error("invitation sender not exist");

    // send invitation details
    const invitationDetails = {
      organization: { name: organization.name },
      invitedByUser: { name: invitedByUser.name, email: invitedByUser.email },
      invitedToUser: { email: tokenPayload.invitedToEmail },
    } as Record<string, any>;

    // check if this api request is for accept or reject the invitation
    if (req.method === "PATCH") {
      const { user } = req;
      const { status } = req.body;
      if (user.email !== invitation.invitedToEmail)
        throw new Error("this invitation is not for current logged user");
      if (!status || !["accepted", "rejected"].includes(status))
        throw new Error("valid status required");

      // Accept the invitation
      if (status === "accepted") {
        // create user and organization linking document
        const newUserOrganization = new userOrganizationModel({
          userId: user._id,
          organizationId: organization._id,
        });
        await newUserOrganization.save();
        // create user role in organization
        const memberRole = await roleModel.findOne({ slug: "member" });
        const userOrganizationRole = new userOrganizationRoleModel({
          userOrganizationId: newUserOrganization._id,
          roleId: memberRole?._id,
        });
        await userOrganizationRole.save();
      }

      // update status of invitation (E.g. "accepted" or "rejected")
      await invitation.updateOne({
        $set: {
          status,
        },
      });

      // delete token from DB
      await tokenModel.deleteOne({ token });

      invitationDetails.message = `invitation ${status} successfully`;
      if (status === "accepted") {
        // add organization full details in response
        invitationDetails.organization = organization;
      }
    }

    // else this api request is to get invitation details
    return res.status(200).json({ ...invitationDetails });
  } catch (error) {
    return res.sendMongooseErrorResponse(error as MongooseError);
  }
};

export default {
  createOrganization,
  getUserOrganizations,
  deleteOrganization,
  sendInvitation,
  handleInvitation,
};
