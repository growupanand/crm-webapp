import { Token } from "@app/types/token";
import { Schema, model } from "mongoose";

const tokenSchema = new Schema<Token>(
  {
    type: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const tokenModel = model<Token>("Token", tokenSchema);

export default tokenModel;
