import {
   AuthenticatedMedusaRequest,
   MedusaRequest,
   MedusaResponse,
} from "@medusajs/medusa";
import {
   ContainerRegistrationKeys,
   MedusaError,
   ModuleRegistrationName,
   remoteQueryObjectFromString,
} from "@medusajs/utils";
import jwt from "jsonwebtoken";
import zod from "zod";
import { createUserWorkflow } from "../../../../workflows/user/workflows/create-user";

const schema = zod
   .object({
      email: zod.string().email(),
      first_name: zod.string().optional(),
      last_name: zod.string().optional(),
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

   const authService = req.scope.resolve(ModuleRegistrationName.AUTH);

   const authUser = await authService.retrieveAuthIdentity(authIdentityId);
   const { jwtSecret } = req.scope.resolve("configModule").projectConfig.http;
   const token = jwt.sign(authUser, jwtSecret);

   res.status(201).json({ user: result, token });
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
   const vendorId = req.params.id;

   if (!vendorId) {
      return MedusaError.Types.NOT_FOUND, "Vendor not found";
   }

   const remoteQuery = req.scope.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
   );

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

   const vendorModuleService = req.scope.resolve("vendorModuleService");

   await vendorModuleService.deleteVendorAdmin(adminId);

   return res.status(200).json({ message: "Admin deleted" });
}
