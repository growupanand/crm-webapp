import tokenModel from "@app/models/token";
import { TokenTypes } from "@app/types/token";
import { User } from "@app/types/user";
import jwt from "jsonwebtoken";
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
 * generate jwt token and save it on database
 * @param payload
 * @param userIds link user id while saving token in database
 * @param saveTokenInDB Do you want to save this generated token in database?
 * @returns token
 */
const generateToken = async (
  type: TokenTypes,
  payload: Record<string, any>,
  userId?: Types.ObjectId,
  saveTokenInDB: boolean = true
) => {
  // user id must be valid before if token need to save in database
  if (saveTokenInDB && (!userId || !isValidObjectId(userId)))
    throw new Error("Unable to generate token. Invalid User Id.");
  try {
    const generatedToken = jwt.sign(
      payload,
      process.env.TOKEN_SECRET as string,
      {
        expiresIn: DEFAULT_EXPIRE_IN,
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
