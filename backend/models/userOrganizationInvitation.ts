import { UserOrganizationInvitation } from "@app/types/userOrganizationInvitation";
import { isValidEmail } from "@app/utils";
import { Schema, model } from "mongoose";

const userOrganizationInvitationSchema = new Schema<UserOrganizationInvitation>(
  {
    invitedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    invitedToEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v: UserOrganizationInvitation["invitedToEmail"]) {
          return isValidEmail(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Create an index on the invitedToEmail and organizationId fields
 * This will make sure no duplicate invitation created for same invitedToEmail and organization
 */
userOrganizationInvitationSchema.index(
  { invitedToEmail: 1, organizationId: 1 },
  { unique: true }
);

const userOrganizationInvitationModel = model<UserOrganizationInvitation>(
  "UserOrganizationInvitation",
  userOrganizationInvitationSchema
);

export default userOrganizationInvitationModel;
