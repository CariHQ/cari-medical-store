import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { RemoteQuery } from "@medusajs/modules-sdk";
import {
  ContainerRegistrationKeys,
  MedusaError,
  ModuleRegistrationName,
  remoteQueryObjectFromString,
} from "@medusajs/utils";
import { deleteProductsWorkflow } from "@medusajs/core-flows";
import { createVendorProductsWorkflow } from "../../../../workflows/vendor/workflows";
import { AdminCreateProduct } from "@medusajs/medusa/dist/api/admin/products/validators";
import { z } from "zod";

const createSchema = z.object({
  products: AdminCreateProduct().array(),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const validatedBody = createSchema.parse(req.body);

  const { result: vendorProducts } = await createVendorProductsWorkflow(
    req.scope
  ).run({
    input: {
      products: validatedBody.products as any[],
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

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY);

  const vendorProductsQuery = remoteQueryObjectFromString({
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
      "vendors.*",
    ],
  });

  const vendorProducts = await remoteQuery(vendorProductsQuery);

  return res.status(200).json({ vendor_products: vendorProducts });
}

const deleteSchema = z.object({
  product_ids: z.string().array(),
});

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const validatedBody = deleteSchema.parse(req.body);

  await deleteProductsWorkflow(req.scope).run({
    input: {
      ids: validatedBody.product_ids,
    },
  });

  return res.status(200).json({ success: true });
}
