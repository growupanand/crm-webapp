import { useAuthStore } from "@app/stores/authStore";
import { apiClient } from "@app/utils/apiClient";
import axios, { AxiosRequestConfig } from "axios";
import { useRef } from "react";

/**
 * This is the type of the client callback function that is returned by the useAPIClient hook.
 */
export type ClientCallback = <ResponseType>(
  endpoint: string,
  axiosConfig: AxiosRequestConfig
) => Promise<ResponseType>;

/**
 * Use this hook to make any api request to backend, this hook give two main feature which we want to use:
 * 1. It give you a function callback which can be used to cancel a ongoing request created by current client instance
 * 2. It will handle some know cause where api request could be failed, E.g. email not verified, token expired.
 *
 *
 * @returns {Object} An object with the following properties:
 *   - `client`: A function to make API requests.
 *   - `cancelRequest`: A function to cancel the ongoing request.
 */
const useAPIClient = () => {
  const { refreshToken, logout } = useAuthStore();

  /**
   * FAQ: Why are we using 'useRef(new AbortController());'
   *
   * To prevent the creation of a new AbortController object on page rerender, we store it in a ref.
   * This ensures that the same AbortController instance is used throughout the component's lifecycle.
   * By doing so, we avoid issues with API request cancellation, particularly when the component rerenders
   * while an API request is still ongoing.
   *
   * Explanation: When an API request is made, and the component rerenders before the request completes,
   * a new AbortController instance is created. This new instance cannot cancel the ongoing request,
   * as the original AbortController instance associated with the request is different.
   * By utilizing a ref to keep track of the same AbortController instance, we ensure that API requests
   * can be correctly canceled regardless of component rerenders.
   */
  const controller = useRef(new AbortController());

  /**
   * The clientCallback function is an async function that uses the apiClient to make API requests.
   * It incorporates the AbortController's signal to enable request cancellation.
   *
   * @param {ApiClientProps} apiClientProps - The properties for the API client request.
   * @returns {Promise} A promise that resolves to the API response.
   */
  const clientCallback = async <ResponseType,>(
    endpoint: string,
    axiosConfig: AxiosRequestConfig
  ): Promise<ResponseType> => {
    try {
      return await apiClient<ResponseType>(endpoint, {
        ...axiosConfig,
        signal: controller.current.signal,
      });
    } catch (error) {
      /**
       * we already know axios will throw error here, if it is not axios error probably it is something we don't know how to handle,
       * But if this is axios error, There could be some known causes when a api request will failed
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
            return await clientCallback(endpoint, previousAxiosConfig);
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
      }

      // else just throw original error
      throw error;
    }
  };

  /**
   * The cancelRequest function cancels the ongoing API request by aborting the current AbortController
   * instance. After canceling the request, a new AbortController instance is created to handle
   * subsequent API requests.
   */
  const cancelRequest = () => {
    controller.current.abort();
    // Now, when the request is canceled, we want to use a new AbortController(),
    // because every new API request will be automatically canceled on the old AbortController()
    // object, which is already canceled.
    controller.current = new AbortController();
  };

  return {
    client: clientCallback,
    cancelRequest,
  };
};

export default useAPIClient;
