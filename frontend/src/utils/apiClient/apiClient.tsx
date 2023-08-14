import { AxiosRequestConfig, AxiosResponse } from "axios";
import client from "./client";

/**
 * This function returns an API client that can be used to make HTTP requests to the backend server.
 * The API client encapsulates the Axios library and provides additional benefits and features.
 *
 * Benefits of using this API client:
 * - Simplified endpoint usage: Instead of setting the entire backend API URL for each request with Axios,
 *   you only need to pass the endpoint path to this client function.
 * - Multiple API clients support: You can create separate API clients for different parts of the app,
 *   allowing you to manage and cancel API requests independently.
 * - Convenient authorization handling: The API client can handle various authorization-related tasks,
 *   such as redirecting users to the email verification page or automatically redirecting to the login page
 *   when a token is expired.
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
  const axiosResponse = await client({
    url: endpoint,
    ...axiosConfig,
    method,
  });

  if (returnAxiosResponse) {
    return axiosResponse;
  }

  return axiosResponse.data;
}
