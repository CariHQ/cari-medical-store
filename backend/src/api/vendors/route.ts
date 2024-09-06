import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { MedusaError, remoteQueryObjectFromString } from "@medusajs/utils";
import { createVendorWorkflow } from "../../workflows/vendor/workflows";
import zod from "zod";
import { CreateVendorDTO } from "../../types/vendor/mutations";
import { getPricesByPriceSetId } from "../../utils/get-prices-by-price-set-id";

const schema = zod.object({
   name: zod.string(),
   handle: zod.string(),
   address: zod.string(),
   phone: zod.string(),
   email: zod.string(),
   image_url: zod.string(),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
   const validatedBody = schema.parse(req.body) as CreateVendorDTO;

   if (!validatedBody) {
      return MedusaError.Types.INVALID_DATA;
   }

   const { transaction } = await createVendorWorkflow(req.scope).run({
      input: {
         vendor: validatedBody,
      },
   });

   return res.status(200).json({ message: "Vendor created", transaction });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
   const queryFilters = req.query;

   const remoteQuery = req.scope.resolve("remoteQuery");

   const vendorsQuery = remoteQueryObjectFromString({
      entryPoint: "vendors",
      fields: [
         "id",
         "handle",
         "name",
         "address",
         "phone",
         "email",
         "image_url",
         "is_open",
      ],
      variables: {
         filters: queryFilters,
      },
   });

   const vendors = await remoteQuery(vendorsQuery);

   for (const vendor of vendors) {
      const vendorProductsQuery = remoteQueryObjectFromString({
         entryPoint: "vendor_product",
         variables: {
            filters: {
               vendor_id: vendor.id,
            },
         },
         fields: ["vendor_id", "product_id"],
      });

      const vendorProducts = await remoteQuery(vendorProductsQuery);

      vendor.products = [];

      if (vendorProducts.length) {
         const productsQuery = remoteQueryObjectFromString({
            entryPoint: "products",
            fields: [
               "id",
               "title",
               "description",
               "thumbnail",
               "categories",
               "categories.id",
               "categories.name",
               "variants",
               "variants.id",
               "variants.price_set",
               "variants.price_set.id",
            ],
            variables: {
               filters: {
                  id: vendorProducts.map((p) => p.product_id),
               },
               relations: ["categories"],
            },
         });

         const products = await remoteQuery(productsQuery);

         const productsWithPrices = await getPricesByPriceSetId({
            products,
            currency_code: "EUR",
            pricingService: req.scope.resolve("pricingModuleService"),
         });

         vendor.products = productsWithPrices;
      }
   }

   return res.status(200).json({ vendors });
}
