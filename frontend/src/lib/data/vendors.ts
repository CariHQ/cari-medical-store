import { VendorDTO } from "@frontend/lib/types";

const BACKEND_URL =
   process.env.BACKEND_URL ||
   process.env.NEXT_PUBLIC_BACKEND_URL ||
   "http://localhost:9000";

export async function retrieveVendor(vendorId: string): Promise<VendorDTO> {
   const { vendor } = await fetch(`${BACKEND_URL}/vendors/${vendorId}`, {
      next: {
         tags: ["vendors"],
      },
   }).then((res) => res.json());
   return vendor;
}

export async function listVendors(
   filter?: Record<string, string>
): Promise<VendorDTO[]> {
   const query = new URLSearchParams(filter).toString();

   const { vendors } = await fetch(`${BACKEND_URL}/vendors?${query}`, {
      next: {
         tags: ["vendors"],
      },
   }).then((res) => res.json());

   return vendors;
}

export async function retrieveVendorByHandle(
   handle: string
): Promise<VendorDTO> {
   const { vendors } = await fetch(`${BACKEND_URL}/vendors?handle=${handle}`, {
      next: {
         tags: ["vendors"],
      },
   }).then((res) => {
      return res.json();
   });

   return vendors[0];
}
