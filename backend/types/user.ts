import { Types } from "mongoose";

// Created separated user model type as we don't want to expose password field in any response,
// So this will allow us to use user type without omit "password" field every time

export type User = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isEmailVerified: boolean;
};

export type UserModel = User & {
  password: string;
};
