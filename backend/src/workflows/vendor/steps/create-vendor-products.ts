import { StepResponse, createStep } from "@medusajs/workflows-sdk";

type StepInput = {
   product_ids: string[];
   vendor_id: string;
};

export const createVendorProductsStepId = "create-vendor-product-step";
export const createVendorProductsStep = createStep(
   createVendorProductsStepId,
   async function (data: StepInput, { container }) {
      const vendorModuleService = container.resolve("vendorModuleService");

      const vendorProductData = data.product_ids.map((product_id) => ({
         vendor_id: data.vendor_id,
         product_id,
      }));

      // Add the product to the vendor
      const vendorProduct = await vendorModuleService.createVendorProducts(
         vendorProductData
      );

      return new StepResponse(vendorProduct, {
         product_ids: data.product_ids,
         vendor_id: data.vendor_id,
      });
   },
   function (
      input: {
         product_ids: string[];
         vendor_id: string;
      },
      { container }
   ) {
      const vendorModuleService = container.resolve("vendorModuleService");

      const vendorProductData = input.product_ids.map((product_id) => ({
         vendor_id: input.vendor_id,
         product_id,
      }));

      return vendorModuleService.deleteVendorProducts(vendorProductData);
   }
);
