import { DEFAULT_ROLES } from "@app/constants";
import roleModel from "@app/models/role";

/**
 * This function seeds default roles into a database if they do not already exist.
 */
export async function seedDefaultRoles() {
  console.log("loading default roles in database");
  for (const role of DEFAULT_ROLES) {
    const existingRole = await roleModel.findOne({ slug: role.slug });
    if (!existingRole) {
      const newRole = new roleModel(role);
      await newRole.save();
      console.log(`Created role: ${role.name}`);
    }
  }
}
