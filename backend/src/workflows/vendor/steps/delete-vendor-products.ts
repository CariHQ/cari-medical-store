import { StepResponse, createStep } from "@medusajs/workflows-sdk";
import { RemoteLink } from "@medusajs/modules-sdk";
import { ContainerRegistrationKeys } from "@medusajs/utils";
import { Modules } from "@medusajs/utils";
type StepInput = {
  product_ids: string[];
  vendor_id: string;
};
export const deleteVendorProductsStepId = "delete-vendor-product-step";
export const deleteVendorProductsStep = createStep(
  deleteVendorProductsStepId,
  async function (data: StepInput, { container }) {
    const remoteLink: RemoteLink = container.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );
    // Delete the link between the product and the vendor and all the linked entities
    for (const product_id of data.product_ids) {
      await remoteLink.dismiss({
        [Modules.PRODUCT]: {
          product_id,
        },
        vendorModuleService: {
          vendor_id: data.vendor_id,
        },
      });
      await remoteLink.delete({
        [Modules.PRODUCT]: {
          product_id,
        },
      });
    }
    return new StepResponse("Links deleted", {
      product_ids: data.product_ids,
      vendor_id: data.vendor_id,
    });
  },
  async function (
    input: {
      product_ids: string[];
      vendor_id: string;
    },
    { container }
  ) {
    const remoteLink: RemoteLink = container.resolve(
      ContainerRegistrationKeys.REMOTE_LINK
    );
    // Restore the link between the product and the vendor
    for (const product_id of input.product_ids) {
      await remoteLink.restore({
        [Modules.PRODUCT]: {
          product_id,
        },
      });
    }
  }
);
