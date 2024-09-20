import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/medusa";
import VendorModuleService from "../../../modules/vendor/service";
import DeliveryModuleService from "../../../modules/delivery/service";
import { VENDOR_MODULE } from "../../../modules/vendor";
import { DELIVERY_MODULE } from "../../../modules/delivery";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { user_id, actor_type } = req.user as {
    user_id: string;
    actor_type: "vendor" | "driver";
  };

  if (actor_type === "vendor") {
    const service: VendorModuleService = req.scope.resolve(VENDOR_MODULE);
    const user = await service.retrieveVendorAdmin(user_id);
    return res.json({ user });
  }

  if (actor_type === "driver") {
    const service: DeliveryModuleService = req.scope.resolve(DELIVERY_MODULE);
    const user = await service.retrieveDriver(user_id);
    return res.json({ user });
  }

  return res.status(404).json({ message: "User not found" });
};
