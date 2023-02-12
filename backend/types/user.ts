import { Types } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isEmailVerified: boolean;
};

export type UserModel = User & {
  password: string;
};
