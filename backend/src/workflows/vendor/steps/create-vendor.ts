import { StepResponse, createStep } from "@medusajs/workflows-sdk";
import { CreateVendorDTO } from "../../../types/vendor/mutations";

export const createVendorStepId = "create-vendor-step";
export const createVendorStep = createStep(
  createVendorStepId,
  async function (data: CreateVendorDTO, { container }) {
    const vendorModuleService = container.resolve("vendorModuleService");

    const vendor = await vendorModuleService.createVendors(data);

    return new StepResponse(vendor, vendor.id);
  },
  function (input: string, { container }) {
    const vendorModuleService = container.resolve("vendorModuleService");

    return vendorModuleService.deleteVendors([input]);
  }
);
