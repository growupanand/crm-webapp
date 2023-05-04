import { Role } from "@app/types/role";
import { Schema, model } from "mongoose";

const roleSchema = new Schema<Role>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isDefaultRole: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const roleModel = model<Role>("role", roleSchema);

export default roleModel;
