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
          res.sendCustomErrorMessage(mongooseError.message, 400);
      }
      return;
    }
    res.sendCustomErrorMessage("Something went wrong");
  };
  next();
}
