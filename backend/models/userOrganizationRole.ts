import { UserOrganizationRole } from "@app/types/userOrganizationRole";
import { Schema, model } from "mongoose";

const userOrganizationRoleSchema = new Schema<UserOrganizationRole>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    userOrganizationId: {
      type: Schema.Types.ObjectId,
      ref: "UserOrganization",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userOrganizationRoleModel = model<UserOrganizationRole>(
  "UserOrganizationRole",
  userOrganizationRoleSchema
);

export default userOrganizationRoleModel;
