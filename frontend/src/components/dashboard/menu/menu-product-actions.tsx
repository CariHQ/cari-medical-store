"use client";

import { deleteProduct } from "@frontend/lib/actions";
import { VendorDTO } from "@frontend/lib/types";
import {
   EllipsisHorizontal,
   PencilSquare,
   Spinner,
   Trash,
} from "@medusajs/icons";
import { ProductDTO } from "@medusajs/types";
import { DropdownMenu, IconButton } from "@medusajs/ui";
import { useState } from "react";

export function MenuProductActions({
   product,
   vendor,
}: {
   product: ProductDTO;
   vendor: VendorDTO;
}) {
   const [isDeleting, setIsDeleting] = useState(false);

   const handleDelete = async () => {
      setIsDeleting(true);
      await deleteProduct(product.id, vendor.id);
      setIsDeleting(false);
   };

   return (
      <DropdownMenu>
         <DropdownMenu.Trigger asChild>
            <IconButton>
               <EllipsisHorizontal />
            </IconButton>
         </DropdownMenu.Trigger>
         <DropdownMenu.Content>
            <DropdownMenu.Item className="gap-x-2" disabled>
               <PencilSquare className="text-ui-fg-disabled" />
               Edit
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item className="gap-x-2" onClick={handleDelete}>
               {isDeleting ? (
                  <Spinner className="animate-spin" />
               ) : (
                  <Trash className="text-ui-fg-subtle" />
               )}
               Delete
            </DropdownMenu.Item>
         </DropdownMenu.Content>
      </DropdownMenu>
   );
}
