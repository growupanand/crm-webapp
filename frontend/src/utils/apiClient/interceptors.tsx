import { InternalAxiosRequestConfig, isAxiosError } from "axios";
import { generateHeaders } from "./headers";

export function onRequestFulfilled(config: InternalAxiosRequestConfig) {
  config.headers = generateHeaders();

  return config;
}

export function onResponseRejected(error: unknown) {
  /**
   * we already know axios will throw error here, if it is not axios error probably it is something we don't know how to handle,
   * But if this is axios error, There could be some known causes when a api request will failed
   */
  if (isAxiosError(error) && error.response) {
    const statusCode = error.response.status;
    const responseBody = error.response.data;

    /**
     * #1 Case: user token is expired or invalid
     * In this case we will logout user manually and redirect him to login screen
     */
    if (statusCode === 401 && window.location.pathname !== "/login") {
      // logout user and redirect to login page
      window.location.href = "/login";
      return;
    }

    /**
     * #2 Case: user has not verified his email
     * In this case we don't want to logout user but redirect him to email not verified screen
     */
    if (
      statusCode === 403 &&
      responseBody.nonFieldError === "Email not verified"
    ) {
      // redirect user to email not verified screen
      window.location.href = "/verify-email";
      return;
    }
  }

  return Promise.reject(error);
}
