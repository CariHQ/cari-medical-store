import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils";
import { z } from "zod";
import { createUserWorkflow } from "../../../../workflows/user/workflows/create-user";
import VendorModuleService from "../../../../modules/vendor/service";
import { VENDOR_MODULE } from "../../../../modules/vendor";

const schema = z
  .object({
    email: z.string().email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  })
  .required({ email: true });

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const authIdentityId = req.auth_context.auth_identity_id;
  const vendorId = req.params.id;

  const validatedBody = schema.parse(req.body) as {
    email: string;
    first_name: string;
    last_name: string;
  };

  const { result, errors } = await createUserWorkflow(req.scope).run({
    input: {
      user: {
        ...validatedBody,
        actor_type: "vendor",
        vendor_id: vendorId,
      },
      auth_identity_id: authIdentityId,
    },
    throwOnError: false,
  });

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error;
  }

  res.status(201).json({ user: result });
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = req.params.id;

  if (!vendorId) {
    return MedusaError.Types.NOT_FOUND, "Vendor not found";
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY);

  const vendorAdminsQuery = remoteQueryObjectFromString({
    entryPoint: "vendor_admin",
    fields: ["id", "email", "first_name", "last_name"],
    variables: {
      filters: {
        vendor_id: vendorId,
      },
    },
  });

  const vendorAdmins = await remoteQuery(vendorAdminsQuery);

  return res.status(200).json({ vendor_admins: vendorAdmins });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const vendorId = req.params.id;
  const adminId = req.params.adminId;

  if (!vendorId || !adminId) {
    return MedusaError.Types.INVALID_DATA;
  }

  const vendorModuleService: VendorModuleService =
    req.scope.resolve(VENDOR_MODULE);

  await vendorModuleService.deleteVendorAdmins(adminId);

  return res.status(200).json({ message: "Admin deleted" });
}
