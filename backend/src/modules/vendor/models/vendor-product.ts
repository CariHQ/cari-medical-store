import { model } from "@medusajs/utils";

export const VendorProduct = model.define("VendorProduct", {
   vendor_id: model.text().primaryKey(),
   product_id: model.text().primaryKey(),
});
