import axios from "axios";
import { onRequestFulfilled } from "./interceptors";

const client = axios.create();
client.interceptors.request.use(onRequestFulfilled);

export default client;
