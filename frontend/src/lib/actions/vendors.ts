"use server";

import { retrieveSession } from "@frontend/lib/data/sessions";
import { VendorDTO, VendorProductDTO } from "@frontend/lib/types";
import { promises as fs } from "fs";
import { revalidatePath, revalidateTag } from "next/cache";

const BACKEND_URL =
   process.env.BACKEND_URL ||
   process.env.NEXT_PUBLIC_BACKEND_URL ||
   "http://localhost:9000";
const FRONTEND_URL =
   (process.env.NEXT_PUBLIC_VERCEL_URL &&
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
   "http://localhost:3000";

export async function setVendorStatus(
   vendorId: string,
   status: boolean
): Promise<VendorDTO | { message: string }> {
   try {
      const { vendor } = await fetch(
         `${BACKEND_URL}/vendors/${vendorId}/status`,
         {
            method: "POST",
            body: JSON.stringify({ is_open: status }),
            headers: {
               "Content-Type": "application/json",
            },
            next: {
               tags: ["vendors"],
            },
         }
      ).then((res) => res.json());

      revalidateTag("vendors");
      revalidatePath("/dashboard/driver");
      revalidatePath("/dashboard/vendor");

      return vendor;
   } catch (error) {
      return { message: "Error setting vendor status" };
   }
}

export async function createProduct(
   prevState: any,
   createProductData: FormData
): Promise<VendorProductDTO | { message: string }> {
   const token = retrieveSession();
   const vendorId = createProductData.get("vendor_id") as string;
   const image = createProductData.get("image") as File;
   const fileName = image?.name;

   if (image) {
      await saveFile(image, fileName as string);
   }

   createProductData.set("thumbnail", `${FRONTEND_URL}/${fileName}`);

   createProductData.delete("image");

   const productData = {} as Record<string, any>;

   Array.from(createProductData.entries()).forEach(([key, value]) => {
      if (key === "vendor_id") {
         return;
      }
      productData[key] = value;
   });

   try {
      const { vendor_product } = await fetch(
         `${BACKEND_URL}/vendors/${vendorId}/products`,
         {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
            credentials: "include",
            next: {
               tags: ["products"],
            },
         }
      ).then((res) => res.json());

      revalidateTag("products");

      return vendor_product;
   } catch (error) {
      return { message: "Error creating product" };
   }
}

async function saveFile(file: File, fileName: string) {
   const data = await file.arrayBuffer();
   await fs.appendFile(`./public/${fileName}`, Buffer.from(data));
   return;
}

export async function deleteProduct(productId: string, vendorId: string) {
   try {
      await fetch(`${BACKEND_URL}/vendors/${vendorId}/products`, {
         method: "DELETE",
         body: JSON.stringify({ product_ids: [productId] }),
         next: {
            tags: ["products"],
         },
      });

      revalidateTag("products");
      revalidateTag("vendors");

      return true;
   } catch (error) {
      return false;
   }
}
