import { MongooseError } from "@app/types/mongooseError";
import { NextFunction, Request, Response } from "express";

/**
 * This controller will provide custom methods inside request object,
 * E.g: res.sendCustomErrorMessage, res.sendMongooseErrorResponse
 * @param req
 * @param res
 * @param next
 */
export default function (_req: Request, res: Response, next: NextFunction) {
  // --------------------CUSTOM VARIABLES-------------------------------------

  // --------------------CUSTOM METHODS----------------------------------------

  res.sendCustomErrorMessage = (message: string, statusCode: number = 400) => {
    return res.status(statusCode).json({
      nonFieldError: message,
    });
  };

  res.sendMongooseErrorResponse = (mongooseError: MongooseError) => {
    if (mongooseError) {
      let errors;
      const errorType = mongooseError.name;
      switch (errorType) {
        // if this is duplicate key error
        case "MongoServerError":
          if (mongooseError.code == 11000) {
            let regex =
              /E11000 .+ index: (?<path>.+)_.+ dup key: { : "(?<value>.+)" }/;
            let match = regex.exec(mongooseError.message);
            if (match?.groups) {
              errors = {
                [match.groups.path]: `'${match.groups.value}' already exist!`,
              };
              break;
            }
          }
          if (mongooseError.keyValue) {
            errors = Object.keys(mongooseError.keyValue!).map((key) => ({
              [key]: `'${mongooseError.keyValue![key]}' already exist!`,
            }));
          }
          break;
        // if this is any type error
        case "ValidationError":
          errors = Object.keys(mongooseError.errors!).map((key) => ({
            [key]: mongooseError.errors![key].message,
          }));
          break;
        default:
      }
      if (errors) {
        res.status(400).send(errors);
      } else {
        res.sendCustomErrorMessage(mongooseError.message, 400);
      }
      return;
    }
    res.sendCustomErrorMessage("Something went wrong");
  };
  next();
}
