import { MongooseError } from "@app/types/mongooseError";
import { User } from "../user";
import { Organization } from "../organization";

// this file is used to override express type 'Request' on app level

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      /**
       * logged in user object
       */
      user: User;
      /** Organization object of Organization Id found url */
      organization: Organization;
    }
    export interface Response {
      /**
       * use this method to send custom error message response
       * @param message custom message text
       * @param statusCode http status code (default:400)
       * @returns { nonFieldError: 'custom error message' }
       */
      sendCustomErrorMessage: (message: string, statusCode?: number) => any;

      /**
       * use this method to send parsed mongoose errors in json
       * @param mongooseError
       * @param res
       * @returns  {'filedName' : 'error message', 'nonFieldError' : 'custom error message'}
       */
      sendMongooseErrorResponse: (mongooseError: MongooseError) => any;

      /**
       * use this method to send custom field error message response
       * @param fieldMessage custom message text
       * @param statusCode http status code (default:400)
       * @returns { 'filedName' : 'error message' }
       * @example
       * res.sendCustomFieldErrorMessage({email: 'email already exist!'})
       * // will return
       * {
       * email: 'email already exist!'
       * }
       */
      sendCustomFieldErrorMessage: (
        fieldMessage: Record<string, any>,
        statusCode?: number
      ) => any;

      // TODO: Need to add correct type for transporter
      /** This is nodemailer transporter, which have methods like sendMail */
      // transporter: any;
    }
  }
}
