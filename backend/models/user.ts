import { UserModel } from "@app/types/user";
import { Schema, model } from "mongoose";
import organizationModel from "./organization";

const userSchema = new Schema<UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("deleteOne", async function (next) {
  const { _id: userId } = this.getQuery();
  // This will force to always get userId in query of
  if (!userId) {
    throw new Error("cannot delete user without giving userId in query");
  }
  next();
});

userSchema.post("deleteOne", async function (doc) {
  const { _id: userId } = this.getQuery();
  // delete all organization created by this user
  await organizationModel.deleteMany({ userId });
});

const userModel = model<UserModel>("User", userSchema);

export default userModel;
