import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { MedusaError, remoteQueryObjectFromString } from "@medusajs/utils";
import { createVendorWorkflow } from "../../workflows/vendor/workflows";
import zod from "zod";
import { CreateVendorDTO } from "src/modules/vendor/types/mutations";

const schema = zod.object({
  name: zod.string(),
  handle: zod.string(),
  address: zod.string(),
  phone: zod.string(),
  email: zod.string(),
  image_url: zod.string().optional(),
});

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const validatedBody = schema.parse(req.body) as CreateVendorDTO;

  if (!validatedBody) {
    return MedusaError.Types.INVALID_DATA;
  }

  const { result: vendor } = await createVendorWorkflow(req.scope).run({
    input: {
      vendor: validatedBody,
    },
  });

  return res.status(200).json({ message: "Vendor created", vendor });
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  // Note: currency code should be small letter. However, since
  // the seed data is using capital letters I've set it here as well.
  const { currency_code = "EUR", ...queryFilters } = req.query;

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
      "products.*",
      "products.categories.*",
      "products.variants.*",
      "products.variants.calculated_price.*",
    ],
    variables: {
      filters: queryFilters,
      "products.variants.calculated_price": {
        context: {
          currency_code,
        },
      },
    },
  });

  const vendors = await remoteQuery(vendorsQuery);

  return res.status(200).json({ vendors });
}
