import { UserOrganization } from "@app/types/userOrganization";
import { Schema, model } from "mongoose";
import userOrganizationRoleModel from "./userOrganizationRole";

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

userOrganizationSchema.pre("deleteMany", async function (next) {
  const { organizationId } = this.getQuery();
  if (!organizationId)
    throw new Error(
      "organizationId required in query to delete all userOrganization linking document"
    );
  const userOrganizations = await userOrganizationModel.find({
    organizationId,
  });
  const userOrganizationIds = userOrganizations.map((i) => i._id);

  // delete all linking documents between userOrganization and role
  await userOrganizationRoleModel.deleteMany({
    userOrganizationId: { $in: userOrganizationIds },
  });
  next();
});

const userOrganizationModel = model<UserOrganization>(
  "UserOrganization",
  userOrganizationSchema
);

export default userOrganizationModel;
