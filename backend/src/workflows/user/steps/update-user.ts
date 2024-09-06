import { MedusaError } from "@medusajs/utils";
import { createStep, StepResponse } from "@medusajs/workflows-sdk";
import { DriverDTO } from "../../../types/delivery/common";
import { VendorAdminDTO } from "../../../types/vendor/common";
import {
   UpdateVendorsDTO,
   UpdateVendorAdminsDTO,
} from "../../../types/vendor/mutations";

type UpdateUserStepInput = (UpdateVendorsDTO | UpdateVendorAdminsDTO) & {
   actor_type: "vendor" | "driver";
};

export const updateUserStepId = "update-user-step";
export const updateUserStep = createStep(
   updateUserStepId,
   async (
      input: UpdateUserStepInput,
      { container }
   ): Promise<
      StepResponse<VendorAdminDTO | DriverDTO, UpdateUserStepInput>
   > => {
      const { actor_type, ...data } = input;

      if (actor_type === "vendor") {
         const service = container.resolve("vendorModuleService");

         const compensationData = {
            ...(await service.retrieveVendorAdmin(data.id)),
            actor_type: "vendor" as "vendor",
         };

         const vendorAdmin = await service.updateVendorAdmins(data);

         return new StepResponse(vendorAdmin, compensationData);
      }

      if (actor_type === "driver") {
         const service = container.resolve("deliveryModuleService");

         const compensationData = {
            ...(await service.retrieveDriver(data.id)),
            actor_type: "driver" as "driver",
         };

         const driver = await service.updateDrivers(data);

         return new StepResponse(driver, compensationData);
      }

      throw MedusaError.Types.INVALID_DATA;
   },
   function ({ actor_type, ...data }: UpdateUserStepInput, { container }) {
      if (actor_type === "vendor") {
         const service = container.resolve("vendorModuleService");

         return service.updateVendorAdmins(data);
      }

      if (actor_type === "driver") {
         const service = container.resolve("deliveryModuleService");

         return service.updateDrivers(data);
      }
   }
);
