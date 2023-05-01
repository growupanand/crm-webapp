import { Token } from "@app/types/token";
import { Schema, model } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    expiredAt: {
      type: Date,
      required: false,
      expires: "0s", // this will delete document automatically on set date
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.pre("save", function (next) {
  // it will make token collection clean by automatically deleting all expired tokens itself
  const tokenPayload = jwt.decode(this.token) as JwtPayload;
  if (tokenPayload && tokenPayload.exp) {
    this.expiredAt = new Date(tokenPayload.exp * 1000);
  }
  next();
});

const tokenModel = model<Token>("Token", tokenSchema);

export default tokenModel;
