import { Types } from "mongoose";

export type TokenTypes =
  | "accessToken"
  | "refreshToken"
  | "emailVerificationToken"
  | "resetPasswordToken"
  | "organizationInvitationToken";

export type Token = {
  type: TokenTypes;
  token: string;
  userId: Types.ObjectId;
};

export type TokenModel = Token;
