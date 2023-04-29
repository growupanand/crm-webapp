import { Types } from "mongoose";

export type UserOrganizationInvitation = {
  _id: Types.ObjectId;
  /** ID of user who send invitation */
  invitedByUserId: Types.ObjectId;
  /** email of user who will receive invitation */
  invitedToEmail: string;
  /** the ID of the organization the user will join */
  organizationId: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
};
