import { SignupForm } from "@frontend/components/dashboard/signup-form";
import { Container, Heading } from "@medusajs/ui";
import { listVendors } from "@frontend/lib/data";

export default async function SignupPage() {
   const vendors = await listVendors();

   return (
      <Container className="flex flex-col gap-4">
         <Heading level="h1" className="text-xl">
            Create your Cari Medical account
         </Heading>
         <SignupForm vendors={vendors} />
      </Container>
   );
}
