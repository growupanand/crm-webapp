import { Customer } from "@app/types/customer";
import { isValidMobileNumber } from "@app/utils";
import { Schema, model } from "mongoose";

const customerSchema = new Schema<Customer>(
  {
    name: { type: String, required: true },
    mobileNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v: Customer["mobileNumber"]) {
          return isValidMobileNumber(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  {
    timestamps: true,
  }
);

// Force model to run field custom validators on update also
customerSchema.pre("findOneAndUpdate", function (next) {
  this.setOptions({
    runValidators: true,
  });
  next();
});

const customerModel = model<Customer>("customer", customerSchema);

export default customerModel;
