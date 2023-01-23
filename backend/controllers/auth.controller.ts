import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@app/utils";
import userModel from "@models/user";
import jwt from "jsonwebtoken";
import { User } from "@app/types/user";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // create new user in database
  const newUser = new userModel({
    name,
    email,
    password: hashedPassword,
  });
  const refreshToken = generateRefreshToken(newUser);
  newUser.refreshToken = refreshToken;
  newUser.save((saveErr, savedData) => {
    if (saveErr) {
      return res.sendMongooseErrorResponse(saveErr);
    }
    const accessToken = generateAccessToken(savedData);
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
    const accessToken = generateAccessToken(user);
    // check if refresh token is generated yet, if not genereate new one and save in db
    if (!user.refreshToken) {
      user.refreshToken = generateRefreshToken(user);
      await user.save();
    }
    const refreshToken = user.refreshToken;
    return res.status(200).json({ accessToken, refreshToken });
  });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  // check if token is in request payload
  if (!refreshToken) return res.sendCustomErrorMessage("Token not found", 401);
  // check if refresh token exist in database
  const user = await userModel.findOne({ refreshToken });
  if (!user) return res.sendCustomErrorMessage("Invalid token", 403);
  // delete user refresh token from database
  await user.updateOne({
    $unset: {
      refreshToken: "",
    },
  });
  return res.status(200).json({ message: "logged out successfully" });
};

const getAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  // check if token is in request payload
  if (!refreshToken) return res.sendCustomErrorMessage("Token not found", 401);
  // check if refresh token exist in database
  const user = await userModel.findOne({ refreshToken });
  if (!user) return res.sendCustomErrorMessage("Invalid token", 403);
  // verify if token is valid
  await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (error: any, payload: any) => {
      if (error) return res.sendCustomErrorMessage("Invalid token", 403);
      const accessToken = generateAccessToken(payload as User);
      return res.status(200).json({ accessToken });
    }
  );
};

export default { register, login, getAccessToken, logout };
