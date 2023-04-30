import { Types } from "mongoose";

export type UserOrganization = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
};
