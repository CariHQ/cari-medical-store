import VendorModule from "../modules/vendor";
import ProductModule from "@medusajs/product";
import { defineLink } from "@medusajs/utils";
export default defineLink(VendorModule.linkable.vendor, {
  linkable: ProductModule.linkable.product,
  isList: true,
});
