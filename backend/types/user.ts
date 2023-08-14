import { Types } from "mongoose";
import { User as SharedUser } from "@shared/types";

// Created separated user model type as we don't want to expose password field in any response,
// So this will allow us to use user type without omit "password" field every time

export type User = Omit<SharedUser, "_id"> & {
  _id: Types.ObjectId;
};

// this type will be used by mongoose

export type UserModel = User & {
  password: string;
};
