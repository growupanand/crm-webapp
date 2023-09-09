import { Types } from "mongoose";
import { Role as SharedRole } from "@shared/types";

export type Role = SharedRole & {
  _id: Types.ObjectId;
};
