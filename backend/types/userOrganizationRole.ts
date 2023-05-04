import { Types } from "mongoose";

export type UserOrganizationRole = {
  _id: Types.ObjectId;
  userOrganizationId: Types.ObjectId;
  roleId: Types.ObjectId;
};
