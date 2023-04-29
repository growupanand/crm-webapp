import tokenModel from "@app/models/token";
import { TokenTypes } from "@app/types/token";
import { User } from "@app/types/user";
import { UserOrganizationInvitation } from "@app/types/userOrganizationInvitation";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types, isValidObjectId } from "mongoose";

const DEFAULT_EXPIRE_IN = "24h";

/**
 * save new generated token in database
 * @param token jwt token
 * @param userIds user id which is linked to this token
 * @returns saved token object
 */
const saveToken = (type: TokenTypes, token: string, userId: Types.ObjectId) => {
  const newToken = new tokenModel({
    type,
    token,
    userId,
  });

  return newToken.save();
};

/**
 * generates a JWT token with optional parameters for saving the
 * token in a database and setting an expiration time.
 * @param {TokenTypes} type - Token type, which can be used to differentiate between different types of
 * tokens (e.g. access token, refresh token, etc.).
 * @param payload - The data that will be encoded in the token. It can be any JSON-serializable data.
 * @param [userId] - The ID of the user for whom the token is being generated. It is optional and only
 * required if the `saveTokenInDB` parameter is set to `true`.
 * @param {boolean} [saveTokenInDB=true] - A boolean flag indicating whether the generated token should
 * be saved in the database or not. If set to true, the function will check if a valid userId is
 * provided and then call the `saveToken` function to save the token in the database. If set to false,
 * the token will not be saved
 * @param [expiresIn] - expiresIn is an optional parameter that specifies the expiration time of the
 * token. It can be expressed in seconds or a string describing a time span using the format
 * [zeit/ms](https://github.com/zeit/ms.js). For example, you can set it to 60 seconds, "2 days",
 * @returns The function `generateToken` returns a Promise that resolves to a string representing the
 * generated token.
 */
const generateToken = async (
  type: TokenTypes,
  payload: Record<string, any>,
  userId?: Types.ObjectId,
  saveTokenInDB: boolean = true,
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  expiresIn?: SignOptions["expiresIn"]
) => {
  // user id must be valid before if token need to save in database
  if (saveTokenInDB && (!userId || !isValidObjectId(userId)))
    throw new Error("Unable to generate token. Invalid User Id.");
  try {
    const generatedToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: expiresIn || DEFAULT_EXPIRE_IN,
      }
    );
    if (saveTokenInDB && userId) await saveToken(type, generatedToken, userId);
    return generatedToken;
  } catch (_) {
    throw new Error("Token not generated");
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
  let payload;
  try {
    payload = jwt.verify(token, process.env.TOKEN_SECRET as string);
    if (checkInDb) {
      const isExistInDB = await tokenModel.findOne({ token });
      if (!isExistInDB)
        throw new Error(`Token:${token} does not exist in database`);
    }
  } catch (_error) {
    return null;
  }
  if (deleteToken) await tokenModel.deleteOne({ token });
  return payload as Record<string, any>;
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
  payload: Omit<UserOrganizationInvitation, "_id" | "status" | "token">
) => {
  return generateToken(
    "organizationInvitationToken",
    payload,
    undefined,
    false,
    "7d"
  );
};
