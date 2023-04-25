import { InsuranceCompany } from "@app/types/insuranceCompany";
import { generateSlug, randomStringKey } from "@app/utils";
import { Schema, model } from "mongoose";

const insuranceCompanySchema = new Schema<InsuranceCompany>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: false, unique: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  {
    timestamps: true,
  }
);

insuranceCompanySchema.pre("save", function (next) {
  let slug = generateSlug(this.name);
  if (slug.length > 78) {
    slug = slug.slice(0, 78);
  }
  this.slug = `${slug}-${randomStringKey(4)}`;
  next();
});

const insuranceCompanyModel = model<InsuranceCompany>(
  "insuranceCompany",
  insuranceCompanySchema
);

export default insuranceCompanyModel;
