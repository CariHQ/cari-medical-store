import { MedusaService } from "@medusajs/utils";
import { Vendor, VendorAdmin } from "./models";

class VendorModuleService extends MedusaService({
  Vendor,
  VendorAdmin,
}) {}

export default VendorModuleService;
