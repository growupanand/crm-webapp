import {
  ALLOWED_PATHS_WITHOUT_MAIL_VERIFIED,
  ALLOWED_PATHS_WITHOUT_USER_LOGGED_IN,
  EMAIL_NOT_VERIFIED_MSG,
  INVALID_TOKEN_MSG,
} from "@app/constants";
import userModel from "@app/models/user";
import { useToken } from "@app/utils";
import { NextFunction, Request, Response } from "express";

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
  // check if this api request needs user to be logged in
  const foundPathWithoutLogin = ALLOWED_PATHS_WITHOUT_USER_LOGGED_IN.find(
    ({ path }) => path === req.path
  );

  const isPathAllowedWithoutLogin = foundPathWithoutLogin?.method.includes(
    req.method
  );

  if (!isPathAllowedWithoutLogin) {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];

      // If user have not provided access token in api request, means he is not logged in
      if (!accessToken) {
        throw new Error("user not logged in");
      }

      // If user provided access token is expired or invalid
      const payload = await useToken(accessToken, false);
      if (!payload) {
        throw new Error(INVALID_TOKEN_MSG);
      }

      // If access token is valid but we are unable to get user details from DB
      const user = await userModel.findOne({
        email: (payload as tokenPayload).email,
      });
      if (!user) {
        throw new Error(INVALID_TOKEN_MSG);
      }

      // If user is logged in but his email is not verified
      const foundPathWithoutMailVerified =
        ALLOWED_PATHS_WITHOUT_MAIL_VERIFIED.find(
          ({ path }) => path === req.path
        );

      const isPathAllowedWithoutMailVerified =
        foundPathWithoutMailVerified?.method.includes(req.method);

      // check if user email is not verified
      if (!isPathAllowedWithoutMailVerified && !user.isEmailVerified) {
        return res.sendCustomErrorMessage(EMAIL_NOT_VERIFIED_MSG, 403);
      }

      // if everything looks good put user object in request object so that it will be accessible in controllers (req.user)
      const { password, ...userJsonWithoutPassword } = user.toJSON();
      req.user = userJsonWithoutPassword;
    } catch (error: any) {
      return res.sendCustomErrorMessage(error.message, 401);
    }
  }

  next();
}
