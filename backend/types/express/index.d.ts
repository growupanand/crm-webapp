import { MongooseError } from "@app/types/mongooseError";

// this file is used to override express type 'Request' on app level

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
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
    }
  }
}
