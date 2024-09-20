import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import zod from "zod";
import VendorModuleService from "../../../../modules/vendor/service";
import { VENDOR_MODULE } from "../../../../modules/vendor";

const schema = zod.object({
  is_open: zod.boolean(),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;
  const { is_open } = schema.parse(req.body);

  const vendorService: VendorModuleService = req.scope.resolve(VENDOR_MODULE);

  try {
    const vendor = await vendorService.updateVendors({
      id,
      is_open,
    });
    res.status(200).json({ vendor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
