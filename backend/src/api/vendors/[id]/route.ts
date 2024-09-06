import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import {
   ContainerRegistrationKeys,
   remoteQueryObjectFromString,
} from "@medusajs/utils";
import { getPricesByPriceSetId } from "../../../utils/get-prices-by-price-set-id";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
   const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
   );

   const vendorId = req.params.id;

   const vendorQuery = remoteQueryObjectFromString({
      entryPoint: "vendors",
      fields: ["*"],
      variables: {
         filters: {
            id: vendorId,
         },
      },
   });

   const vendor = await remoteQuery(vendorQuery).then((r) => r[0]);

   const vendorProductsQuery = remoteQueryObjectFromString({
      entryPoint: "vendor_product",
      fields: ["product_id"],
      variables: {
         filters: {
            vendor_id: vendorId,
         },
      },
   });

   const vendorProducts = await remoteQuery(vendorProductsQuery);

   const productsQuery = remoteQueryObjectFromString({
      entryPoint: "products",
      fields: [
         "id",
         "title",
         "description",
         "thumbnail",
         "categories",
         "categories.id",
         "categories.handle",
         "variants",
         "variants.id",
         "variants.price_set",
         "variants.price_set.id",
      ],
      variables: {
         filters: {
            id: vendorProducts.map((p) => p.product_id),
         },
      },
   });

   const products = await remoteQuery(productsQuery);

   const pricedProducts = await getPricesByPriceSetId({
      products,
      currency_code: "EUR",
      pricingService: req.scope.resolve("pricingModuleService"),
   });

   vendor.products = pricedProducts;

   return res.status(200).json({ vendor });
}
