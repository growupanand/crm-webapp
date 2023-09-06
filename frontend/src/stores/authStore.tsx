import { User } from "@app/types/user";
import { apiClient } from "@app/utils/apiClient";
import {
  getAccessToken,
  getRefreshToken,
  getUser,
  resetLocalStorage,
  setAccessToken,
  setRefreshToken,
  setUser,
} from "@app/utils/storage";
import { create } from "zustand";

interface AuthState {
  /** Is user logged in */
  isAuthenticated: boolean;
  /** Logged in user details */
  user: User | null;
  /** Initialize auth store with provided user tokens */
  init: (accessToken: string, refreshToken: string) => Promise<void>;
  /** Refresh access token using this function */
  refreshToken: () => Promise<string>;
  /** Logout current user and redirect to login page */
  logout: () => void;
}

/**
 * User this store manage user authentication
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!getAccessToken(),
  user: getUser(),

  init: async (accessToken, refreshToken) => {
    resetLocalStorage();

    // first we will save tokens in local storage
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    // now we will try to fetch user details
    const user = await apiClient<User>("user/me/", {});
    setUser(user);
    set((cs) => ({
      ...cs,
      isAuthenticated: true,
      user: user,
    }));
  },

  refreshToken: async () => {
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
  },

  logout: () => {
    resetLocalStorage();
    window.location.href = "/auth/login";
  },
}));