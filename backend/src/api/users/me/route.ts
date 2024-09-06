import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { DriverDTO } from "../../../types/delivery/common";
import { VendorAdminDTO } from "../../../types/vendor/common";

export const GET = async (
   req: AuthenticatedMedusaRequest,
   res: MedusaResponse
) => {
   const { user_id, actor_type } = req.user as {
      user_id: string;
      actor_type: "vendor" | "driver";
   };
   let user = {} as VendorAdminDTO | DriverDTO;

   if (actor_type === "vendor") {
      const service = req.scope.resolve("vendorModuleService");
      user = await service.retrieveVendorAdmin(user_id);
      return res.json({ user });
   }

   if (actor_type === "driver") {
      const service = req.scope.resolve("deliveryModuleService");
      user = await service.retrieveDriver(user_id);
      return res.json({ user });
   }

   return res.status(404).json({ message: "User not found" });
};
