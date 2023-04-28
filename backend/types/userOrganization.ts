import { Types } from "mongoose";

export type UserOrganization = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  organization: Types.ObjectId;
};
