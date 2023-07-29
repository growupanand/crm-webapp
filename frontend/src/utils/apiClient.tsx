import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type Props = {
  path: string;
  config: AxiosRequestConfig;
};

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
 * @param path - The path of the endpoint to which the API request will be made (e.g., "api/register").
 * @param config - An optional configuration object that can contain the HTTP method and payload data.
 * @returns A Promise containing the Axios response with the specified response type.
 * @template ResponseType - The type of the expected response data from the server.
 */

export async function apiClient<ResponseType>(
  props: Props
): Promise<AxiosResponse<ResponseType, any>> {
  const { config, path } = props;
  const method = config.method || "GET";
  const baseURL = ` ${process.env.REACT_APP_BACKEND_URL}/api`;
  const apiEndpoint = `${baseURL}/${path}`;

  try {
    return await axios({
      url: apiEndpoint,
      ...props.config,
      method,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      /**
       * we already know axios will throw error here, if it is not axios error probably it is something we don't know how to handle
       * There could be some known causes when a api request will failed
       */

      const statusCode = error.response.status;
      const responseBody = error.response.data;

      /**
       * #1 Case: user token is expired or invalid
       * In this case we will logout user manually and redirect him to login screen
       */
      if (statusCode === 401) {
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
    throw new Error(error);
  }
}
