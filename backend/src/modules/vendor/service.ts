import { MedusaService } from "@medusajs/utils";
import { Vendor, VendorAdmin, VendorProduct } from "./models";

class VendorModuleService extends MedusaService({
   Vendor,
   VendorAdmin,
   VendorProduct,
}) {}

export default VendorModuleService;
