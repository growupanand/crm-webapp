import { UserOrganization } from "@app/types/userOrganization";
import { Schema, model } from "mongoose";

const userOrganizationSchema = new Schema<UserOrganization>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userOrganizationModel = model<UserOrganization>(
  "UserOrganization",
  userOrganizationSchema
);

export default userOrganizationModel;
