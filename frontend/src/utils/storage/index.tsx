import { removeAccessToken } from "./accessToken";
import { removeRefreshToken } from "./refreshToken";
import { removeUser } from "./user";

export * from "./accessToken";
export * from "./refreshToken";

export const STORAGE_SUFFIX = "CRM-WEBAPP";

export const resetLocalStorage = () => {
  removeAccessToken();
  removeRefreshToken();
  removeUser();
};
