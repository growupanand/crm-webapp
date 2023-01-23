import { User } from "@app/types/user";
import jwt from "jsonwebtoken";

/**
 * This will generate jwt token with user details in payload which will expire in some time
 * @param user user objecct
 * @returns
 */
export const generateAccessToken = (user: User) => {
  const payload = {
    name: user.name,
    email: user.email,
  };
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "10s",
    }
  );
  return accessToken;
};

/**
 * This will generate jwt token
 * @param user user objecct
 * @returns
 */
export const generateRefreshToken = (user: User) => {
  const payload = {
    name: user.name,
    email: user.email,
  };
  const accessToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string
  );
  return accessToken;
};
