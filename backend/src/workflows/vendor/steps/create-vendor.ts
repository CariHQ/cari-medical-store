import { StepResponse, createStep } from "@medusajs/workflows-sdk";
import { CreateVendorDTO } from "../../../modules/vendor/types/mutations";
import { VENDOR_MODULE } from "../../../modules/vendor";

export const createVendorStepId = "create-vendor-step";
export const createVendorStep = createStep(
  createVendorStepId,
  async function (data: CreateVendorDTO, { container }) {
    const vendorModuleService = container.resolve(VENDOR_MODULE);

    const vendor = await vendorModuleService.createVendors(data);

    return new StepResponse(vendor, vendor.id);
  },
  function (input: string, { container }) {
    const vendorModuleService = container.resolve(VENDOR_MODULE);

    return vendorModuleService.deleteVendors([input]);
  }
);
