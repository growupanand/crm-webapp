import { Types } from "mongoose";
import { Organization as SharedOrganization } from "@shared/types";

export type Organization = Omit<SharedOrganization, "_id" | "userId"> & {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
};
