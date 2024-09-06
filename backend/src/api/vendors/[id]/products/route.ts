import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import {
   ContainerRegistrationKeys,
   MedusaError,
   ModuleRegistrationName,
   remoteQueryObjectFromString,
} from "@medusajs/utils";
import zod from "zod";
import { createVendorProductsWorkflow } from "../../../../workflows/vendor/workflows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
   const { products } = JSON.parse(req.body as string);

   const { result: vendorProducts } = await createVendorProductsWorkflow(
      req.scope
   ).run({
      input: {
         products,
         vendor_id: req.params.id,
      },
   });

   // Return the product
   return res.status(200).json({ vendor_products: vendorProducts });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
   const vendorId = req.params.id;

   if (!vendorId) {
      return MedusaError.Types.NOT_FOUND;
   }

   const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
   );

   const vendorProductsQuery = remoteQueryObjectFromString({
      entryPoint: "vendor_product",
      variables: {
         filters: {
            vendor_id: vendorId,
         },
      },
      fields: ["vendor_id", "product_id"],
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
      },
   });

   const products = await remoteQuery(productsQuery);

   return res.status(200).json({ vendor_products: products });
}

const deleteSchema = zod.object({
   product_id: zod.string(),
});

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
   const parsedBody = JSON.parse(req.body as string);
   const validatedBody = deleteSchema.parse(parsedBody);

   if (!validatedBody) {
      return res.status(400).json({ message: "Missing vendor admin data" });
   }

   const vendorId = req.params.id;

   if (!vendorId) {
      return res.status(400).json({ message: "Missing vendor id" });
   }

   const vendorModuleService = req.scope.resolve("vendorModuleService");

   const productModuleService = req.scope.resolve(
      ModuleRegistrationName.PRODUCT
   );

   await productModuleService.deleteProducts([validatedBody.product_id]);

   await vendorModuleService.deleteVendorProducts({
      vendor_id: vendorId,
      product_id: validatedBody.product_id,
   });

   return res.status(200);
}
