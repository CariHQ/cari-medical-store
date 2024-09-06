import { model } from "@medusajs/utils";

export const Vendor = model.define("Vendor", {
   id: model
      .id({
         prefix: "res",
      })
      .primaryKey(),
   handle: model.text(),
   is_open: model.boolean(),
   name: model.text(),
   description: model.text().nullable(),
   phone: model.text(),
   email: model.text(),
   address: model.text(),
   image_url: model.text().nullable(),
});
