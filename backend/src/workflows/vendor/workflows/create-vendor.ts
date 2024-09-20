import {
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/workflows-sdk";
import { CreateVendorDTO } from "../../../modules/vendor/types/mutations";
import { createVendorStep } from "../steps";

type WorkflowInput = {
  vendor: CreateVendorDTO;
};

export const createVendorWorkflow = createWorkflow(
  "create-vendor-workflow",
  function (input: WorkflowData<WorkflowInput>) {
    const vendor = createVendorStep(input.vendor);

    return new WorkflowResponse(vendor);
  }
);
