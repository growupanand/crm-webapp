import { DatabaseBaseType } from "./DatabaseBaseType";

export type Organization = DatabaseBaseType & {
  name: string;
  slug: string;
  userId: string;
};
