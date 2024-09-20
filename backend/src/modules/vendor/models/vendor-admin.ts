import { model } from "@medusajs/utils";
import { Vendor } from "./vendor";

export const VendorAdmin = model.define("vendor_admin", {
  id: model
    .id({
      prefix: "venadm",
    })
    .primaryKey(),
  first_name: model.text(),
  last_name: model.text(),
  vendor_id: model.text(),
  email: model.text(),
  avatar_url: model.text().nullable(),
  vendor: model.belongsTo(() => Vendor, { mappedBy: "admins" }),
});
