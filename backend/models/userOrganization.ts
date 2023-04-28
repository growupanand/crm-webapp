import { UserOrganization } from "@app/types/userOrganization";
import { Schema, model } from "mongoose";

const userOrganizationSchema = new Schema<UserOrganization>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    }
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
