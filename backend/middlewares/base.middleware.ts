import { DEFAULT_MONGOOSE_ERROR_MESSAGE } from "@app/constants";
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
  // ===========================[CUSTOM VARIABLES]=============================

  // ==========================================================================

  // ============================[CUSTOM METHODS]==============================

  // <----------------------[Send customer error message]----------------------
  res.sendCustomErrorMessage = (message: string, statusCode: number = 400) => {
    return res.status(statusCode).json({
      nonFieldError: message,
    });
  };
  // ----------------------------------------------------------------------------->

  // <------[Handle error thrown from mongoose]-----------------------------------
  res.sendMongooseErrorResponse = (mongooseError: MongooseError) => {
    let errors: Record<string, any> = {};
    const errorType = mongooseError.name;
    switch (errorType) {
      // Error for duplicate value
      case "MongoServerError":
        if (mongooseError.code == 11000) {
          let regex =
            /E11000 .+ index: (?<field>.+)_.+ dup key: { : "(?<value>.+)" }/;
          let match = regex.exec(mongooseError.message);
          if (match?.groups) {
            errors = {
              [match.groups.field]: `'${match.groups.value}' already exist!`,
            };
            break;
          }
        }
        if (mongooseError.keyValue) {
          for (let field in mongooseError.keyValue) {
            errors[field] = `'${mongooseError.keyValue[field]}' already exist!`;
          }
        }
        break;
      // Error related to type of value
      case "ValidationError":
        for (let field in mongooseError.errors) {
          errors[field] = mongooseError.errors[field].message;
        }
        break;
      // Error for wrong field name
      case "CastError":
        const { path, value, kind } = mongooseError as any;
        errors = {
          [path]: `${value} is not valid ${kind}`,
        };
        break;
      default:
        errors["nonFieldError"] =
          mongooseError.message || DEFAULT_MONGOOSE_ERROR_MESSAGE;
    }
    return res.status(400).send(errors);
  };
  // ----------------------------------------------------------------------------->

  next();
}
