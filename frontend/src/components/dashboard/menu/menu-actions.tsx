"use client";

import { VendorDTO } from "@frontend/lib/types";
import { ProductCategoryDTO } from "@medusajs/types";
import { CreateCategoryDrawer } from "./create-category-drawer";
import { CreateProductDrawer } from "./create-product-drawer";

export function MenuActions({
   vendor,
   categories,
}: {
   vendor: VendorDTO;
   categories: ProductCategoryDTO[];
}) {
   return (
      <div className="flex gap-4">
         <CreateCategoryDrawer vendor={vendor} />
         <CreateProductDrawer vendor={vendor} categories={categories} />
      </div>
   );
}
