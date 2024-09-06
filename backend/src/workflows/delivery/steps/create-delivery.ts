import { MedusaError, remoteQueryObjectFromString } from "@medusajs/utils";
import { StepResponse, createStep } from "@medusajs/workflows-sdk";

export type CreateDeliveryStepInput = {
   cart_id: string;
};

export const createDeliveryStepId = "create-delivery-step";
export const createDeliveryStep = createStep(
   createDeliveryStepId,
   async function (input: CreateDeliveryStepInput, { container, context }) {
      const remoteQuery = container.resolve("remoteQuery");

      const cartQuery = remoteQueryObjectFromString({
         entryPoint: "carts",
         variables: {
            id: input.cart_id,
         },
         fields: ["id", "metadata.vendor_id"],
      });

      const cart = await remoteQuery(cartQuery).then((res) => res[0]);

      const vendor_id = cart.metadata?.vendor_id as string;

      if (!vendor_id) {
         throw MedusaError.Types.INVALID_DATA;
      }

      const data = {
         cart_id: cart.id,
         vendor_id,
         transaction_id: context.transactionId,
      };

      const service = container.resolve("deliveryModuleService");

      const delivery = await service.createDeliveries(data);

      return new StepResponse(delivery, delivery.id);
   },
   (deliveryId: string, { container }) => {
      const service = container.resolve("deliveryModuleService");

      return service.softDeleteDeliveries(deliveryId);
   }
);
