import { Types } from "mongoose";

export type InsuranceCompany = {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  slug: string;
};
