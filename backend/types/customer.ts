import { Types } from "mongoose";
import { Customer as SharedCustomer } from "@shared/types";

export type Customer = Omit<SharedCustomer, "_id" | "organizationId"> & {
  _id: Types.ObjectId;
  name: string;
  mobileNumber: string;
  organizationId: Types.ObjectId;
};
