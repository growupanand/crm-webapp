import { Response } from "express";
import { CallbackError } from "mongoose";

type MongooseError = CallbackError & {
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
};

/**
 * catch mongoose error and return response with errors field name as key and message as value
 * @param mongooseError
 * @param res
 * @returns
 */
export const sendMongooseErrorResponse = (
  mongooseError: MongooseError,
  res: Response
) => {
  if (mongooseError) {
    let errors;
    const errorType = mongooseError.name;
    switch (errorType) {
      case "MongoServerError": // if this is duplicate key error
        errors = Object.keys(mongooseError.keyValue!).map((key) => ({
          [key]: `'${mongooseError.keyValue![key]}' already exist!`,
        }));
        res.status(400).json(errors);
        break;
      case "ValidationError": // if this is any type error
        errors = Object.keys(mongooseError.errors!).map((key) => ({
          [key]: mongooseError.errors![key].message,
        }));
        res.status(400).send(errors);
        break;
      default:
        res.status(400).send({ nonFieldError: mongooseError.message });
    }
    return;
  }
  res.status(400).send({ nonFieldError: "Something went wrong" });
};
