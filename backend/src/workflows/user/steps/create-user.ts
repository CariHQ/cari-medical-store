import { MedusaError } from "@medusajs/utils";
import { createStep, StepResponse } from "@medusajs/workflows-sdk";
import { DriverDTO } from "../../../types/delivery/common";
import { VendorAdminDTO } from "../../../types/vendor/common";
import {
   CreateDriverInput,
   CreateVendorAdminInput,
} from "../workflows/create-user";

type CreateUserStepInput = (CreateVendorAdminInput | CreateDriverInput) & {
   actor_type: "vendor" | "driver";
};

type CompensationStepInput = {
   id: string;
   actor_type: string;
};

export const createUserStepId = "create-user-step";
export const createUserStep = createStep(
   createUserStepId,
   async (
      input: CreateUserStepInput,
      { container }
   ): Promise<
      StepResponse<VendorAdminDTO | DriverDTO, CompensationStepInput>
   > => {
      if (input.actor_type === "vendor") {
         const service = container.resolve("vendorModuleService");

         const vendorAdmin = await service.createVendorAdmins(
            input as CreateVendorAdminInput
         );

         const compensationData = {
            id: vendorAdmin.id,
            actor_type: "vendor",
         };

         return new StepResponse(vendorAdmin, compensationData);
      }

      if (input.actor_type === "driver") {
         const service = container.resolve("deliveryModuleService");

         const driver = await service.createDrivers(input as CreateDriverInput);

         const driverWithAvatar = await service.updateDrivers({
            id: driver.id,
            avatar_url: `https://robohash.org/${driver.id}?size=40x40&set=set1&bgset=bg1`,
         });

         const compensationData = {
            id: driverWithAvatar.id,
            actor_type: "driver",
         };

         return new StepResponse(driverWithAvatar, compensationData);
      }

      throw MedusaError.Types.INVALID_DATA;
   },
   function ({ id, actor_type }: CompensationStepInput, { container }) {
      if (actor_type === "vendor") {
         const service = container.resolve("vendorModuleService");

         return service.deleteVendorAdmin(id);
      }

      if (actor_type === "driver") {
         const service = container.resolve("deliveryModuleService");

         return service.deleteDrivers(id);
      }
   }
);
