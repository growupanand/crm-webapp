import axios from "axios";
import { onRequestFulfilled, onResponseRejected } from "./interceptors";

const baseURL = ` ${process.env.REACT_APP_BACKEND_URL}/api/`;

const client = axios.create({
  baseURL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

client.interceptors.request.use(onRequestFulfilled);
client.interceptors.response.use((response) => response, onResponseRejected);

export default client;
