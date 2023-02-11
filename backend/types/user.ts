import { Types } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isEmailVerified: boolean;
  refreshToken: string;
};

export type UserModel = User & {
  password: string;
};
