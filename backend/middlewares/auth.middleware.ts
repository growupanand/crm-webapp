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
  // verify access token on every api request
  const token = req.headers["authorization"];
  const accessToken = token && token.split(" ")[1];
  if (!accessToken) return res.sendCustomErrorMessage("No token found", 400);
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (error, tokenPayload) => {
      if (error || !tokenPayload)
        return res.sendCustomErrorMessage("Invalid token", 400);
      const user = await userModel.findOne({
        email: (tokenPayload as tokenPayload).email,
      });
      if (!user) return res.sendCustomErrorMessage("User not found", 400);

      // check if user email is verified
      const allowedUrls = ["/api/user/resendEmailVerification/"];
      if (!user.isEmailVerified && !allowedUrls.includes(req.originalUrl))
        return res.sendCustomErrorMessage("Email not verified", 401);

      // if everything looks good put user object in request and continue middleware
      const { password, ...userJson } = user.toJSON();
      req.user = userJson;
      next();
    }
  );
}
