import VendorModule from "../modules/vendor";
import DeliveryModule from "../modules/delivery";
import { defineLink } from "@medusajs/utils";

export default defineLink(VendorModule.linkable.vendor, {
  linkable: DeliveryModule.linkable.delivery,
  isList: true,
});
