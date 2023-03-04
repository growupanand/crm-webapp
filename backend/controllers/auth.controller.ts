import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  deleteAccessTokens,
  deleteEmailVerificationTokens,
  deleteRefreshTokens,
  deleteResetPasswordTokens,
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
  generateResetPasswordToken,
  useToken,
} from "@app/utils";
import userModel from "@models/user";
import { User } from "@app/types/user";
import { sendMail } from "@app/utils/sendMail";
import { baseUrl } from "@app/index";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // create new user in database
  const newUser = new userModel({
    name,
    email,
    password: hashedPassword,
  });
  const refreshToken = await generateRefreshToken(newUser);
  newUser.save(async (saveErr, savedData) => {
    if (saveErr) {
      return res.sendMongooseErrorResponse(saveErr);
    }
    const accessToken = await generateAccessToken(savedData);
    const emailVerificationToken = await generateEmailVerificationToken(
      savedData
    );
    sendMail({
      senderMail: savedData.email,
      subject: "Registration successfully",
      text: `Hi ${savedData.name}, you successfully registered. Please verify your email using below link.\n${baseUrl}api/auth/verifyEmail/${emailVerificationToken}/`,
    });
    return res.status(200).json({ accessToken, refreshToken });
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errMessage = "Username or password is incorrect";
  // check if user exist with provided email
  const user = await userModel.findOne({ email });
  if (!user) return res.sendCustomErrorMessage(errMessage, 400);

  // check if password provided is correct
  bcrypt.compare(password, user.password, async (error, result) => {
    if (error || !result) {
      return res.sendCustomErrorMessage(errMessage, 400);
    }
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    return res.status(200).json({ accessToken, refreshToken });
  });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  // check if token is in request payload
  if (!refreshToken) return res.sendCustomErrorMessage("Token not found", 401);
  // check if refresh token exist in database
  const tokenData = await useToken(refreshToken, false, true);
  if (!tokenData || !tokenData.email)
    return res.sendCustomErrorMessage("Invalid token", 403);
  const user = await userModel.findOne({ email: tokenData.email });
  if (!user) return res.sendCustomErrorMessage("Invalid token", 403);
  // delete all old access tokens and refresh tokens of this user
  await deleteAccessTokens(user);
  await deleteRefreshTokens(user);
  return res.status(200).json({ message: "logged out successfully" });
};

const getAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  // check if token is in request payload
  if (!refreshToken) return res.sendCustomErrorMessage("Token not found", 400);
  // check if refresh token exist in database
  const user = await userModel.findOne({ refreshToken });
  if (!user) return res.sendCustomErrorMessage("Invalid token", 400);
  // verify if token is valid
  const payload = await useToken(refreshToken, false);
  if (!payload) return res.sendCustomErrorMessage("Invalid token", 400);
  const accessToken = await generateAccessToken(user as User);
  return res.status(200).json({ accessToken });
};

const verifyEmailToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  const payload = await useToken(token);
  if (!payload?.email) return res.sendCustomErrorMessage("Invalid token", 400);
  // verify email of user
  try {
    await userModel.updateOne(
      { email: payload.email },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );
    return res.status(200).json({ message: "Email verified" });
  } catch (_error) {
    return res.sendCustomErrorMessage("Unable to verify email", 500);
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const defaultMessage = "Email send successfully";
  const { email, token, password, confirmPassword } = req.body;
  if (!email || email.trim() === "")
    return res.sendCustomErrorMessage("Please provide email address", 400);

  // check if request is for reset password
  if (token) {
    // check if password match with confirm password
    if (!password || !confirmPassword || password !== confirmPassword)
      return res.sendCustomErrorMessage("Password not match", 400);
    // verify token
    const payload = await useToken(token);
    if (!payload?.email)
      return res.sendCustomErrorMessage("Invalid token", 400);
    // check if provided token belong to email
    if (email !== payload.email)
      return res.sendCustomErrorMessage("Invalid token", 400);
    const user = await userModel.findOne({ email: payload.email });
    if (!user) return res.sendCustomErrorMessage("Invalid token", 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    // delete all old access tokens and refresh tokens of this user
    await deleteAccessTokens(user);
    await deleteRefreshTokens(user);
    user.password = hashedPassword;
    user.save((error) => {
      if (error) return res.sendMongooseErrorResponse(error);
      return res.status(200).json({ message: "Password reset successfully" });
    });
    return;
  }
  const user = await userModel.findOne({ email: email });
  if (!user) return res.status(200).json({ message: defaultMessage }); // send 200 ok status even if user not found, so that hacker cannot use this api to find user exist by email
  // delete old reset password tokens
  await deleteResetPasswordTokens(user);
  const generatedToken = await generateResetPasswordToken(user);
  const data = await sendMail({
    senderMail: user.email,
    subject: "Reset password",
    text: `Hi ${user.name}, Please use below token to reset your password.\n${generatedToken}`,
  });
  if (!data) return res.sendCustomErrorMessage("Unable to send mail", 500);
  return res.status(200).json({ message: defaultMessage });
};

export default {
  /** Register new user */
  register,
  /** Login user */
  login,
  /** Get fresh access token */
  getAccessToken,
  /** Logout user from all sessions */
  logout,
  /** Verify user email */
  verifyEmailToken,
  /** Send reset password mail */
  resetPassword,
};
