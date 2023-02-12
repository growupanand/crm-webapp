import { Types } from "mongoose";

export type TokenTypes =
  | "accessToken"
  | "refreshToken"
  | "emailVerificationToken"
  | "resetPasswordToken";

export type Token = {
  type: TokenTypes;
  token: string;
  userId: Types.ObjectId;
};

export type TokenModel = Token;
