import { CallbackError } from "mongoose";

export type MongooseError = CallbackError & {
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
  code?: number;
};
