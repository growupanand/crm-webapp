import { AxiosHeaders } from "axios";
import { getAccessToken } from "../storage";

/**
 * The function generates headers for an Axios request with an access token.
 * @returns an instance of the AxiosHeaders class with the specified headers and the authorization
 * header set with the access token.
 */
export function generateHeaders(): AxiosHeaders {
  const headers = new AxiosHeaders({
    Accept: "application/json; charset=utf-8",
    ["Content-Type"]: "application/json",
  });

  const accessToken = getAccessToken();
  headers.set("authorization", `Bearer ${accessToken}`);

  return headers;
}
