import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { RemoteQueryFunction } from "@medusajs/modules-sdk";
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils";
// import { getPricesByPriceSetId } from "../../../utils/get-prices-by-price-set-id";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const remoteQuery: RemoteQueryFunction = req.scope.resolve(
    ContainerRegistrationKeys.REMOTE_QUERY
  );

  const vendorId = req.params.id;

  const vendorQuery = remoteQueryObjectFromString({
    entryPoint: "vendors",
    fields: [
      "*",
      "products.*",
      "products.categories.*",
      "products.categories.*",
      "products.variants.*",
      "products.variants.calculated_price.*",
      "deliveries.*",
      "deliveries.cart.*",
      "deliveries.cart.items.*",
      "deliveries.order.*",
      "deliveries.order.items.*",
    ],
    variables: {
      filters: {
        id: vendorId,
      },
      "products.variants.calculated_price": {
        context: {
          currency_code: "eur",
        },
      },
    },
  });

  const vendor = await remoteQuery(vendorQuery).then((r) => r[0]);

  return res.status(200).json({ vendor });
}
