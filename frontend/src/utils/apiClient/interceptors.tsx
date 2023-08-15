import { InternalAxiosRequestConfig } from "axios";
import { generateHeaders } from "./headers";

const baseURL = ` ${process.env.REACT_APP_BACKEND_URL}/api/`;

export function onRequestFulfilled(config: InternalAxiosRequestConfig) {
  config.baseURL = baseURL;
  config.headers = generateHeaders();

  return config;
}
