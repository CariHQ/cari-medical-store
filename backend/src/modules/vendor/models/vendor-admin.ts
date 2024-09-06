import { model } from "@medusajs/utils";

export const VendorAdmin = model.define("VendorAdmin", {
   id: model
      .id({
         prefix: "resadm",
      })
      .primaryKey(),
   first_name: model.text(),
   last_name: model.text(),
   vendor_id: model.text(),
   email: model.text(),
   avatar_url: model.text().nullable(),
});
