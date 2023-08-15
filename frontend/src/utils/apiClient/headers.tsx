import { AxiosHeaders } from "axios";
import { getAccessToken } from "../storage";

/**
 * The function generates headers for an Axios request with authorization and CORS settings.
 * @returns an instance of the AxiosHeaders class with the specified headers.
 */
export function generateHeaders(): AxiosHeaders {
  const accessToken = getAccessToken();

  const headers = new AxiosHeaders({
    Accept: "application/json; charset=utf-8",
    ["Content-Type"]: "application/json",
    ["Access-Control-Allow-Origin"]: "*",
    ["Access-Control-Allow-Headers"]: "*",
    ["Access-Control-Allow-Methods"]: "*",
    authorization: `Bearer ${accessToken}`,
  });

  return headers;
}
