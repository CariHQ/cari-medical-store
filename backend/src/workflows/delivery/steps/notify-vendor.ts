import {
  ModuleRegistrationName,
  remoteQueryObjectFromString,
} from "@medusajs/utils";
import { createStep } from "@medusajs/workflows-sdk";

export const notifyVendorStepId = "notify-vendor-step";
export const notifyVendorStep = createStep(
  {
    name: notifyVendorStepId,
    async: true,
    timeout: 60 * 15,
    maxRetries: 2,
  },
  async function (deliveryId: string, { container }) {
    const remoteQuery = container.resolve("remoteQuery");

    const deliveryQuery = remoteQueryObjectFromString({
      entryPoint: "deliveries",
      variables: {
        filters: {
          id: deliveryId,
        },
      },
      fields: ["id", "vendor.id"],
    });

    const delivery = await remoteQuery(deliveryQuery).then((res) => res[0]);

    const eventBus = container.resolve(ModuleRegistrationName.EVENT_BUS);

    await eventBus.emit({
      name: "notify.vendor",
      data: {
        vendor_id: delivery.vendor.id,
        delivery_id: delivery.id,
      },
    });
  },
  function (input: string, { container }) {
    const logger = container.resolve("logger");

    logger.error("Failed to notify vendor", { input });
  }
);
