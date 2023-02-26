import { Customer } from "@app/types/customer";
import { Schema, model } from "mongoose";

const customerSchema = new Schema<Customer>({
  name: { type: String, required: true },
  mobileNumber: { type: Number, required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
});

const customerModel = model<Customer>("customer", customerSchema);

export default customerModel;
