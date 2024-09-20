import { MedusaError } from "@medusajs/utils";
import { createStep, StepResponse } from "@medusajs/workflows-sdk";
import { DriverDTO } from "../../../modules/delivery/types/common";
import {
  UpdateVendorsDTO,
  UpdateVendorAdminsDTO,
} from "../../../modules/vendor/types/mutations";
import { VendorAdminDTO } from "../../../modules/vendor/types/common";
import { VENDOR_MODULE } from "../../../modules/vendor";
import { DELIVERY_MODULE } from "../../../modules/delivery";

type UpdateUserStepInput = (UpdateVendorsDTO | UpdateVendorAdminsDTO) & {
  actor_type: "vendor" | "driver";
};

export const updateUserStepId = "update-user-step";
export const updateUserStep = createStep(
  updateUserStepId,
  async (
    input: UpdateUserStepInput,
    { container }
  ): Promise<StepResponse<VendorAdminDTO | DriverDTO, UpdateUserStepInput>> => {
    const { actor_type, ...data } = input;

    if (actor_type === "vendor") {
      const service = container.resolve(VENDOR_MODULE);

      const compensationData = {
        ...(await service.retrieveVendorAdmin(data.id)),
        actor_type: "vendor" as "vendor",
      };

      const vendorAdmin = await service.updateVendorAdmins(data);

      return new StepResponse(vendorAdmin, compensationData);
    }

    if (actor_type === "driver") {
      const service = container.resolve(DELIVERY_MODULE);

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
      const service = container.resolve(VENDOR_MODULE);

      return service.updateVendorAdmins(data);
    }

    if (actor_type === "driver") {
      const service = container.resolve(DELIVERY_MODULE);

      return service.updateDrivers(data);
    }
  }
);
