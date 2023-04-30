import tokenModel from "@app/models/token";
import {
  OrganizationInvitationTokenPayload,
  TokenTypes,
} from "@app/types/token";
import { User } from "@app/types/user";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Types, isValidObjectId } from "mongoose";

const DEFAULT_EXPIRE_IN = "24h";

/**
 * This function saves a token with its type, value, user ID, and organization ID to the database.
 * @param {TokenTypes} type - TokenTypes is a custom type that specifies the type of token being saved
 * (e.g. "access token", "refresh token", etc.).
 * @param {string} token - The `token` parameter is a string that represents the actual token that
 * needs to be saved. It could be an access token, refresh token, or any other type of token used for
 * authentication or authorization purposes.
 * @param userId - userId is a parameter of type Types.ObjectId, which represents the unique identifier
 * of a user in the database. It is used to associate the token with a specific user.
 * @param organizationId - The `organizationId` parameter is of type `Types.ObjectId` and represents
 * the unique identifier of the organization associated with the token being saved.
 * @returns The `saveToken` function returns a promise that resolves to the newly created token object
 * after it has been saved to the database.
 */
const saveToken = (
  type: TokenTypes,
  token: string,
  userId: Types.ObjectId,
  organizationId: Types.ObjectId
) => {
  const newToken = new tokenModel({
    type,
    token,
    userId,
    organizationId,
  });

  return newToken.save();
};

type TokenPayload<T extends TokenTypes> =
  T extends "organizationInvitationToken"
    ? // organizationId will be required in payload for all organization related token
      { [key: string]: any; organizationId: Types.ObjectId }
    : Record<string, any>;

/**
 * This is a TypeScript function that generates a token with a specified type, payload, and expiration
 * time, and optionally saves it in a database.
 * @param {T} type - The type of token being generated. It is a generic type that extends the
 * TokenTypes enum.
 * @param payload - The payload parameter is an object that contains the data that will be encoded in
 * the token. The type of the payload object is determined by the type parameter, which is a generic
 * type that extends the TokenTypes enum. The payload object must match the shape of the TokenPayload
 * interface for the corresponding token type
 * @param [userId] - The ID of the user for whom the token is being generated. This is used to save the
 * token in the database for future authentication.
 * @param {boolean} [saveTokenInDB=true] - `saveTokenInDB` is a boolean parameter that determines
 * whether the generated token should be saved in the database or not. If set to `true`, the token will
 * be saved in the database, otherwise it won't be saved.
 * @param [expiresIn] - The expiresIn parameter is an optional parameter that specifies the expiration
 * time of the token. It can be expressed in seconds or a string describing a time span using the
 * [zeit/ms](https://github.com/zeit/ms.js) library. If this parameter is not provided, the token will
 * expire after the default
 * @returns The function `generateToken` returns a Promise that resolves to a string, which is the
 * generated token.
 */
const generateToken = async <T extends TokenTypes>(
  type: T,
  payload: TokenPayload<T>,
  userId?: Types.ObjectId,
  saveTokenInDB: boolean = true,
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: SignOptions["expiresIn"]
) => {
  const organizationId = payload.organizationId;
  try {
    const generatedToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: expiresIn || DEFAULT_EXPIRE_IN,
      }
    );
    if (saveTokenInDB) {
      // valid user id required to save token in database
      if (!userId || !isValidObjectId(userId))
        throw new Error("Unable to generate token. Invalid User Id.");
      // valid organization id also required to saved organization related token in database
      if (["organizationInvitationToken"].includes(type) && !organizationId)
        throw new Error("Unable to generate token. Invalid Organization Id.");
      await saveToken(type, generatedToken, userId, organizationId);
    }
    return generatedToken;
  } catch (error: any) {
    throw new Error(error.message || "Token not generated");
  }
};

/**
 * This will verify token and return payload,
 * @param token
 * @param deleteToken `default:true`
 * @param checkInDb `default:true`
 * @returns
 */
export const useToken = async (
  token: string,
  /** Should delete token from database after token verified successfully */
  deleteToken: boolean = true,
  /** Should token exist in database */
  checkInDb: boolean = true
) => {
  try {
    if (token.split(".").length !== 3) throw new Error("invalid token");
    if (checkInDb) {
      const isExistInDB = await tokenModel.findOne({ token });
      if (!isExistInDB) throw new Error(`Token does not exist`);
      if (deleteToken) await tokenModel.deleteOne({ token });
    }
    const payload = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;
    return payload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") throw new Error("token expired");
    throw error;
  }
};

/**
 * This will generate jwt token with user details in payload
 * @param user user object
 * @returns token
 */
export const generateAccessToken = (
  user: Pick<User, "name" | "email" | "_id">
) => {
  const payload = {
    name: user.name,
    email: user.email,
  };
  return generateToken("accessToken", payload, user._id);
};

/**
 * This will delete all access tokens of user
 * @param user user object
 * @returns token
 */
export const deleteAccessTokens = async (user: Pick<User, "_id">) => {
  try {
    await tokenModel.deleteMany({
      type: "accessToken",
      userId: user._id,
    });
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * This will generate jwt token
 * @param user user object
 * @returns token
 */
export const generateRefreshToken = (
  user: Pick<User, "name" | "email" | "_id">
) => {
  const payload = {
    name: user.name,
    email: user.email,
  };
  return generateToken("refreshToken", payload, user._id);
};

/**
 * This will delete all refresh tokens of user
 * @param user user object
 * @returns token
 */
export const deleteRefreshTokens = async (user: Pick<User, "_id">) => {
  try {
    await tokenModel.deleteMany({
      type: "refreshToken",
      userId: user._id,
    });
  } catch (_error) {
    return false;
  }
  return true;
};

/**
 * Use this to generate email verification token
 * @param user
 * @returns token
 */
export const generateEmailVerificationToken = (
  user: Pick<User, "email" | "_id">
) => {
  const payload = {
    email: user.email,
  };
  return generateToken("emailVerificationToken", payload, user._id);
};

/**
 * This will delete all email verification tokens of user
 * @param user user object
 * @returns token
 */
export const deleteEmailVerificationTokens = async (
  user: Pick<User, "_id">
) => {
  try {
    await tokenModel.deleteMany({
      type: "emailVerificationToken",
      userId: user._id,
    });
  } catch (_error) {
    return false;
  }
  return true;
};

/**
 * Use this to generate reset password token
 * @param user
 * @returns token
 */
export const generateResetPasswordToken = (
  user: Pick<User, "email" | "_id">
) => {
  const payload = {
    email: user.email,
  };
  return generateToken("resetPasswordToken", payload, user._id);
};

/**
 * This will delete all reset password tokens of user
 * @param user user object
 * @returns token
 */
export const deleteResetPasswordTokens = async (user: Pick<User, "_id">) => {
  try {
    await tokenModel.deleteMany({
      type: "resetPasswordToken",
      userId: user._id,
    });
  } catch (_error) {
    return false;
  }
  return true;
};

/**
 * This TypeScript function generates an organization invitation token with a payload and a 7-day
 * expiration time.
 * @param payload - The payload parameter is an object of type UserOrganizationInvitation, with the
 * "_id", "status", and "token" properties omitted. This object contains the data that will be used to
 * generate the organization invitation token.
 * @returns The function `generateOrganizationInvitationToken` is returning a token generated using the
 * `generateToken` function. The token is of type "organizationInvitationToken" and is generated using
 * the `payload` object passed as an argument to the function. The token does not have an expiration
 * date and is not signed. The function returns the generated token.
 */
export const generateOrganizationInvitationToken = (
  payload: OrganizationInvitationTokenPayload
) => {
  return generateToken(
    "organizationInvitationToken",
    payload,
    payload.invitedByUserId,
    true,
    "7d"
  );
};
