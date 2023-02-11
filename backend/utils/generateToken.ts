import { User } from "@app/types/user";
import jwt from "jsonwebtoken";

/**
 * This will generate jwt token with user details in payload which will expire in given time (default:24 hours)
 * @param user user object
 * @returns token
 */
export const generateAccessToken = (user: User) => {
  const payload = {
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "24h",
  });
  return token;
};

/**
 * This will generate jwt token
 * @param user user objecct
 * @returns token
 */
export const generateRefreshToken = (user: User) => {
  const payload = {
    name: user.name,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string);
  return token;
};

/**
 * User this to generate email verification token which will expire in 24 hours
 * @param user
 * @returns token
 */
export const generateEmailVerificationToken = (user: User) => {
  const payload = {
    email: user.email,
  };
  const token = jwt.sign(
    payload,
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET as string,
    {
      expiresIn: "24h",
    }
  );
  return token;
};
