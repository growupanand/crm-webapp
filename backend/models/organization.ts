import { Organization } from "@app/types/organization";
import { generateSlug, randomStringKey } from "@app/utils";
import { Schema, model } from "mongoose";
import userOrganizationModel from "@app/models/userOrganization";
import userOrganizationInvitationModel from "./userOrganizationInvitation";

const organizationSchema = new Schema<Organization>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: { type: String, required: false, unique: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Generate organization slug before saving it
 */
organizationSchema.pre("save", function (next) {
  let slug = generateSlug(this.name);
  if (slug.length > 78) {
    slug = slug.slice(0, 78);
  }
  this.slug = `${slug}-${randomStringKey(4)}`;
  next();
});

/**
 * Before deleting an organization delete its linked documents first
 */
organizationSchema.pre("deleteOne", async function (next) {
  const { _id } = this.getQuery();

  if (!_id) {
    throw new Error("_id required in query to delete organization.");
  }
  // delete linking documents between this organization and all users
  await userOrganizationModel.deleteMany({
    organization: _id,
  });

  // delete all invitations of this organization
  await userOrganizationInvitationModel.deleteMany({
    organizationId: _id,
  });

  next();
});

const organizationModel = model<Organization>(
  "Organization",
  organizationSchema
);

export default organizationModel;
