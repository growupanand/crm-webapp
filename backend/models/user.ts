import { User } from "@app/types/user";
import { Schema, model } from "mongoose";
import organizationModel from "./organization";

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: false,
  },
});

userSchema.pre("deleteOne", async function (next) {
  const { _id: userId } = this.getQuery();
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

const userModel = model<User>("User", userSchema);

export default userModel;
