import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { remoteQueryObjectFromString } from "@medusajs/utils";
import { z } from "zod";
import {
  DeliveryItemDTO,
  DeliveryStatus,
} from "../../../modules/delivery/types/common";
import { UpdateDeliveryDTO } from "../../../modules/delivery/types/mutations";
import { updateDeliveryWorkflow } from "../../../workflows/delivery/workflows";

const schema = z.object({
  driver_id: z.string().optional(),
  notified_driver_ids: z.array(z.string()).optional(),
  order_id: z.string().optional(),
  delivery_status: z.nativeEnum(DeliveryStatus).optional(),
  eta: z.date().optional(),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const validatedBody = schema.parse(req.body);

  const deliveryId = req.params.id;

  const updateData: UpdateDeliveryDTO = {
    id: deliveryId,
    ...validatedBody,
  };

  if (validatedBody.delivery_status === "delivered") {
    updateData.delivered_at = new Date();
  }

  try {
    const delivery = await updateDeliveryWorkflow(req.scope).run({
      input: {
        data: updateData,
      },
    });

    return res.status(200).json({ delivery });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const deliveryId = req.params.id;

  const remoteQuery = req.scope.resolve("remoteQuery");

  const deliveryQuery = remoteQueryObjectFromString({
    entryPoint: "deliveries",
    fields: [
      "*",
      "cart.*",
      "cart.items.*",
      "order.*",
      "order.items.*",
      "vendor.*",
    ],
    variables: {
      filters: {
        id: deliveryId,
      },
    },
  });

  const delivery = await remoteQuery(deliveryQuery).then((r) => r[0]);

  if (!delivery) {
    return res.status(404).json({ message: "Delivery not found" });
  }

  try {
    return res.status(200).json({ delivery });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
