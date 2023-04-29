import { Types } from "mongoose";

export type TokenTypes =
  | "accessToken"
  | "refreshToken"
  | "emailVerificationToken"
  | "resetPasswordToken"
  | "organizationInvitationToken";

export type Token =
  | {
      type: Exclude<TokenTypes, "organizationInvitationToken">;
      token: string;
      userId: Types.ObjectId;
    }
  | {
      type: "organizationInvitationToken";
      token: string;
      userId: Types.ObjectId;
      /** organizationId required for all organization related tokens */
      organizationId: Types.ObjectId;
    };

export type TokenModel = Token;
