import {
  createProductsWorkflow,
  createRemoteLinkStep,
} from "@medusajs/core-flows";
import { CreateProductDTO } from "@medusajs/types";
import { Modules } from "@medusajs/utils";
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk";
import { VENDOR_MODULE } from "../../../modules/vendor";

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

    const links = transform(
      {
        products,
        input,
      },
      (data) =>
        data.products.map((product) => ({
          [VENDOR_MODULE]: {
            vendor_id: data.input.vendor_id,
          },
          [Modules.PRODUCT]: {
            product_id: product.id,
          },
        }))
    );

    createRemoteLinkStep(links);

    return new WorkflowResponse(links);
  }
);
