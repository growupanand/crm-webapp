import { DatabaseBaseType } from "./DatabaseBaseType";

export type Customer = DatabaseBaseType & {
  _id: string;
  name: string;
  mobileNumber: string;
  organizationId: string;
};
