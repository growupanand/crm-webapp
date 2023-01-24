import { Types } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  refreshToken: string;
};
