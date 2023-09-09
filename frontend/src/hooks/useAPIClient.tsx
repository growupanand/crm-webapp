import { apiClient } from "@app/utils/apiClient";
import { AxiosRequestConfig } from "axios";
import { useRef } from "react";

/**
 * This is the type of the client callback function that is returned by the useAPIClient hook.
 */
export type ClientCallback = <ResponseType>(
  endpoint: string,
  axiosConfig: AxiosRequestConfig
) => Promise<ResponseType>;

/**
 * Use this hook to make any api request to backend
 *
 * @returns {Object} An object with the following properties:
 *   - `client`: A function to make API requests.
 *   - `cancelRequest`: A function to cancel the ongoing request.
 */
const useAPIClient = () => {
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
    return await apiClient<ResponseType>(endpoint, {
      ...axiosConfig,
      signal: controller.current.signal,
    });
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
