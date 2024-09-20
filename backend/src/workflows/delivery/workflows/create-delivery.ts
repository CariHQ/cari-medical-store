import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk";
import { Modules } from "@medusajs/utils";
import { createRemoteLinkStep } from "@medusajs/core-flows";
import { DeliveryDTO } from "../../../modules/delivery/types/common";
import { createDeliveryStep } from "../../delivery/steps";
import { DELIVERY_MODULE } from "../../../modules/delivery";
import { VENDOR_MODULE } from "../../../modules/vendor";

type WorkflowInput = {
  cart_id: string;
  vendor_id: string;
};

export const createDeliveryWorkflowId = "create-delivery-workflow";
export const createDeliveryWorkflow = createWorkflow(
  createDeliveryWorkflowId,
  function (input: WorkflowData<WorkflowInput>): WorkflowResponse<DeliveryDTO> {
    const delivery = createDeliveryStep();
    const links = transform(
      {
        input,
        delivery,
      },
      (data) => [
        {
          [DELIVERY_MODULE]: {
            delivery_id: data.delivery.id,
          },
          [Modules.CART]: {
            cart_id: data.input.cart_id,
          },
        },
        {
          [VENDOR_MODULE]: {
            vendor_id: data.input.vendor_id,
          },
          [DELIVERY_MODULE]: {
            delivery_id: data.delivery.id,
          },
        },
      ]
    );
    createRemoteLinkStep(links);

    return new WorkflowResponse(delivery);
  }
);
