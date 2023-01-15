import userModel from "@app/models/user";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type tokenPayload = {
  email: string;
  name: string;
};

/**
 * This middleware will verify access token on each api request
 * @param req
 * @param res
 * @param next
 * @returns
 */
export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // check if access token exist in request
  const token = req.headers["authorization"];
  const accessToken = token && token.split(" ")[1];
  if (!accessToken) return res.sendCustomErrorMessage("No token found", 401);

  // verify token and verified include user object in request object
  await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (error, tokenPayload) => {
      if (error || !tokenPayload)
        return res.sendCustomErrorMessage("Invalid token", 401);
      const user = await userModel.findOne({
        email: (tokenPayload as tokenPayload).email,
      });
      if (!user) return res.sendCustomErrorMessage("User not found", 401);
      const { password, ...userJson } = user.toJSON();
      req.user = userJson;
      next();
    }
  );
}
