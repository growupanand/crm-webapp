import { apiClient } from "./apiClient";
import { getRefreshToken, resetLocalStorage, setAccessToken } from "./storage";

/**
 * Logout current user and redirect to login page
 */
export const logout = () => {
  resetLocalStorage();
  window.location.href = "/auth/login";
};

/**
 *  Refresh user access token
 * @returns new access token
 */
export const refreshToken = async () => {
  try {
    const { accessToken } = await apiClient<{ accessToken: string }>(
      "auth/getAccessToken",
      {
        method: "POST",
        data: {
          refreshToken: getRefreshToken(),
        },
      }
    );
    setAccessToken(accessToken);
    return accessToken;
  } catch (error) {
    // if we are unable to refresh access token, we will logout user and redirect to login page
    logout();
  }
};
