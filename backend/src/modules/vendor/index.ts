import Service from "./service";

import { Module } from "@medusajs/utils";

export const VENDOR_MODULE = "vendorModuleService";

export default Module(VENDOR_MODULE, {
  service: Service,
});
