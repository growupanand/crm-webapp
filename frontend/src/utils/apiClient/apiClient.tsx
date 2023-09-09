import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import client from "./client";
import { logout, refreshToken } from "@app/utils/auth";

/**
 * This function can be used to make HTTP requests to the backend server. The API client encapsulates the Axios library
 *  and provides additional benefits and features.
 *
 * Benefits of using this API client:
 *
 * - Simplified endpoint usage: Instead of setting the entire backend API URL for each request with Axios,
 *   you only need to pass the endpoint path to this client function.
 *
 * - Multiple API clients support: You can create separate API clients for different parts of the app,
 *   allowing you to manage and cancel API requests independently.
 *
 * - Convenient authorization handling: The API client can handle various authorization-related tasks,
 *   such as:
 *    - Redirecting users to the email verification page.
 *    - Automatically redirecting to the login page when a token is expired.
 *    - Automatically refreshing the access token (and retrying the request that failed due to an expired token).
 *
 *
 *
 * @param {string} endpoint - The `endpoint` parameter is a string that represents the URL or path of
 * the API endpoint you want to make a request to. It specifies the location where the API is hosted
 * and the specific resource or action you want to interact with.
 * @param {AxiosRequestConfig} axiosConfig - The `axiosConfig` parameter is an object that contains
 * configuration options for the Axios HTTP client. It can include properties such as `method` (HTTP
 * method), `headers` (HTTP headers), `data` (request payload), and others. These options are used to
 * customize the behavior of the HTTP
 * @param {boolean} [returnAxiosResponse] - The `returnAxiosResponse` parameter is an optional boolean
 * flag that determines whether the function should return the full Axios response or just the response
 * data. If `returnAxiosResponse` is set to `true`, the function will return the full Axios response,
 * including status code, headers, etc.
 * @returns The function `apiClient` returns a `Promise` that resolves to an `AxiosResponse` object.
 * @template ResponseType - The type of the expected response data from the server.
 */
export async function apiClient<ResponseType>(
  endpoint: string,
  axiosConfig: AxiosRequestConfig,
  returnAxiosResponse: true // -------------------> if true then return type will be AxiosResponse
): Promise<AxiosResponse<ResponseType, any>>;
export async function apiClient<ResponseType>(
  endpoint: string,
  axiosConfig: AxiosRequestConfig,
  returnAxiosResponse?: false // -----------------> if false then return type will be ResponseType
): Promise<ResponseType>;
export async function apiClient<ResponseType>(
  endpoint: string,
  axiosConfig: AxiosRequestConfig,
  returnAxiosResponse?: boolean // -----------------> if undefined then return type will be ResponseType
): Promise<AxiosResponse<ResponseType, any>> {
  const method = axiosConfig.method || "GET";

  try {
    const axiosResponse = await client({
      url: endpoint,
      ...axiosConfig,
      method,
    });

    if (returnAxiosResponse) {
      return axiosResponse;
    }

    return axiosResponse.data;
  } catch (error) {
    /**
     * we already know axios will throw error here, if it is not axios error probably it is something we don't know how to handle,
     * But if this is axios error, There could be some known causes when a api request will failed:
     * 1. user token is expired or invalid
     * 2. user email is not verified
     * 3. user is not authenticated
     */

    if (axios.isAxiosError(error)) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data.nonFieldError;

      /**
       * # Case 1. user token is expired or invalid
       *    In this case we will try to get new access token using refresh token
       */
      if (statusCode === 401 && errorMessage === "Invalid token") {
        // fetch new access token
        const newAccessToken = await refreshToken();

        // once new access token successfully fetched, we will retry previous api call
        if (newAccessToken) {
          const previousAxiosConfig = error.config;
          previousAxiosConfig.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // we want to use clientCallback recursively here, so that case 2 (email not verified) can be checked on retry previous api call
          return await apiClient(endpoint, previousAxiosConfig);
        }

        // if we are unable to refresh access token, we will logout user and redirect to login page
        logout();
        return;
      }

      /**
       * #2 Case: user has not verified his email
       * In this case we don't want to logout user but redirect him to email not verified screen
       */
      if (statusCode === 403) {
        // redirect user to email not verified screen
        window.location.href = "/verify-email";
        return;
      }

      /**
       * #3 Case: user is not authenticated
       * In this case we will logout user and redirect him to login page
       * */
      if (statusCode === 401) {
        // logout user and redirect to login page
        logout();
        return;
      }

      throw error;
    } else {
      throw error;
    }
  }
}
