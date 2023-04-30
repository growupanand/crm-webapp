import { UserOrganization } from "@app/types/userOrganization";
import { Schema, model } from "mongoose";

const userOrganizationSchema = new Schema<UserOrganization>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
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
