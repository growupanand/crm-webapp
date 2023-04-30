import {
  ALLOWED_URLS_WO_MAIL_VERIFIED,
  ALLOWED_API_REQ_WO_USER_LOGGED_IN,
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
  const allowedPathWoLoggedIn = ALLOWED_API_REQ_WO_USER_LOGGED_IN.find(
    ({ path }) => path === req.path
  );
  if (
    !allowedPathWoLoggedIn ||
    !allowedPathWoLoggedIn.method.includes(req.method)
  ) {
    // verify access token on every api request except for ALLOWED_URLS_WO_USER_LOGGED_IN
    const token = req.headers["authorization"];
    const accessToken = token && token.split(" ")[1];
    if (!accessToken)
      return res.sendCustomErrorMessage("user not logged in", 401);
    const payload = await useToken(accessToken, false);
    if (!payload) return res.sendCustomErrorMessage("Invalid token", 400);
    const user = await userModel.findOne({
      email: (payload as tokenPayload).email,
    });
    if (!user) return res.sendCustomErrorMessage("User not found", 400);

    // check if this api request needs logged in user mail verified
    const allowedPathWoMailVerified = ALLOWED_URLS_WO_MAIL_VERIFIED.find(
      ({ path }) => path === req.path
    );
    // check if user email is verified
    if (
      (!allowedPathWoMailVerified ||
        !allowedPathWoMailVerified.method.includes(req.method)) &&
      !user.isEmailVerified
    )
      return res.sendCustomErrorMessage("Email not verified", 401);
    // if everything looks good put user object in request and continue middleware
    const { password, ...userJson } = user.toJSON();
    req.user = userJson;
  }

  next();
}
