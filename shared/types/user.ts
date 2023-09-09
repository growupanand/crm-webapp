import { DatabaseBaseType } from "./DatabaseBaseType";

export type User = DatabaseBaseType & {
  name: string;
  email: string;
  isEmailVerified: boolean;
};
