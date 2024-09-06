import { VendorDTO } from "@frontend/lib/types";
import VendorCategory from "@frontend/components/store/vendor/vendor-category";
import { Button, Container, Heading, Text } from "@medusajs/ui";
import Link from "next/link";
import { Github } from "@medusajs/icons";
import DemoModal from "@frontend/components/common/demo-modal";

const BACKEND_URL =
   process.env.BACKEND_URL ||
   process.env.NEXT_PUBLIC_BACKEND_URL ||
   "http://localhost:9000";

export default async function Home() {
   const vendors = await fetch(BACKEND_URL + "/vendors")
      .then((res) => res.json())
      .then(({ vendors }: { vendors: VendorDTO[] }) =>
         vendors.filter((vendor: VendorDTO) => vendor.is_open)
      );

   if (!vendors) {
      return <Heading level="h1">No vendors open near you</Heading>;
   }

   return (
      <div className="flex flex-col gap-8">
         {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && <DemoModal />}
         <VendorCategory vendors={vendors} />
      </div>
   );
}
