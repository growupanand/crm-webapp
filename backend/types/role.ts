import { Types } from "mongoose";

export type Role = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  /** default roles cannot be modified */
  isDefaultRole: boolean;
};
