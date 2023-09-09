import { DatabaseBaseType } from "./DatabaseBaseType";

export type Role = DatabaseBaseType & {
  name: string;
  slug: string;
  description: string;
  /** default roles cannot be modified */
  isDefaultRole: boolean;
};
