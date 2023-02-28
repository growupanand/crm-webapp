import { Customer } from "@app/types/customer";
import { isValidMobileNumber } from "@app/utils";
import { Schema, model } from "mongoose";

const customerSchema = new Schema<Customer>({
  name: { type: String, required: true },
  mobileNumber: {
    type: Number,
    required: true,
    validate: {
      validator: function (v: number) {
        return isValidMobileNumber(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
});

const customerModel = model<Customer>("customer", customerSchema);

export default customerModel;
