import { createProductsWorkflow } from "@medusajs/core-flows";
import { CreateProductDTO } from "@medusajs/types";
import {
   WorkflowData,
   WorkflowResponse,
   createWorkflow,
   transform,
} from "@medusajs/workflows-sdk";
import { createVendorProductsStep } from "../steps";

type WorkflowInput = {
   products: CreateProductDTO[];
   vendor_id: string;
};

export const createVendorProductsWorkflow = createWorkflow(
   "create-vendor-products-workflow",
   function (input: WorkflowData<WorkflowInput>) {
      const products = createProductsWorkflow.runAsStep({
         input: {
            products: input.products,
         },
      });

      const product_ids = transform(products, (products) =>
         products.map((product) => product.id)
      );

      const vendorProduct = createVendorProductsStep({
         product_ids,
         vendor_id: input.vendor_id,
      });

      return new WorkflowResponse(vendorProduct);
   }
);
