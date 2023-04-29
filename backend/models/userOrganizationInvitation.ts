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
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userOrganizationInvitationModel = model<UserOrganizationInvitation>(
  "UserOrganizationInvitation",
  userOrganizationInvitationSchema
);

export default userOrganizationInvitationModel;
