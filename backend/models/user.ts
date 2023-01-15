import { User } from "@app/types/user";
import { Schema, model } from "mongoose";

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
});

const userModel = model<User>("User", userSchema);

export default userModel;
