import { Organization } from "@app/types/organization";
import { generateSlug, randomStringKey } from "@app/utils";
import { Schema, model } from "mongoose";

const organizationSchema = new Schema<Organization>({
  name: {
    type: String,
    required: true,
  },
  slug: { type: String, required: false, unique: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    index: true,
  },
});

organizationSchema.pre("save", function (next) {
  let slug = generateSlug(this.name);
  if (slug.length > 78) {
    slug = slug.slice(0, 78);
  }
  this.slug = `${slug}-${randomStringKey(4)}`;
  next();
});

const organizationModel = model<Organization>(
  "Organization",
  organizationSchema
);

export default organizationModel;
