import { Types } from "mongoose";

export type Customer = {
  _id: Types.ObjectId;
  name: string;
  mobileNumber: string;
  organizationId: Types.ObjectId;
};
