import { model } from "@medusajs/utils";
import { VendorAdmin } from "./vendor-admin";

export const Vendor = model.define("vendor", {
  id: model
    .id({
      prefix: "ven",
    })
    .primaryKey(),
  handle: model.text(),
  is_open: model.boolean().default(false),
  name: model.text(),
  description: model.text().nullable(),
  phone: model.text(),
  email: model.text(),
  address: model.text(),
  image_url: model.text().nullable(),
  admins: model.hasMany(() => VendorAdmin),
});
