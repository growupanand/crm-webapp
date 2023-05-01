import { Types } from "mongoose";
import { UserOrganizationInvitation } from "@app/types/userOrganizationInvitation";

export type TokenTypes =
  | "accessToken"
  | "refreshToken"
  | "emailVerificationToken"
  | "resetPasswordToken"
  | "organizationInvitationToken";

export type Token =
  | {
      expiredAt: Date;
      type: Exclude<TokenTypes, "organizationInvitationToken">;
      token: string;
      userId: Types.ObjectId;
    }
  | {
      expiredAt: Date;
      type: "organizationInvitationToken";
      token: string;
      userId: Types.ObjectId;
      /** organizationId required for all organization related tokens */
      organizationId: Types.ObjectId;
    };

/**
 * JWT token payload types
 */

export type OrganizationInvitationTokenPayload = Omit<
  UserOrganizationInvitation,
  "_id" | "status" | "token"
>;

export type TokenModel = Token;
