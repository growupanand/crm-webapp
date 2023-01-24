import { Types } from "mongoose";

export type Organization = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  userId: Types.ObjectId;
};
