"use client";

import { VendorDTO } from "@frontend/lib/types";
import { Plus } from "@medusajs/icons";
import { ProductCategoryDTO } from "@medusajs/types";
import { Button, Drawer, Text } from "@medusajs/ui";
import { CreateProductForm } from "./create-product-form";

export function CreateProductDrawer({
   vendor,
   categories,
}: {
   vendor: VendorDTO;
   categories: ProductCategoryDTO[];
}) {
   return (
      <Drawer>
         <Drawer.Trigger asChild>
            <Button variant="primary" size="large">
               <Plus />
               Create Menu Item
            </Button>
         </Drawer.Trigger>
         <Drawer.Content className="z-50">
            <Drawer.Header>
               <Drawer.Title>Create Menu Item</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
               <Text>
                  This is where you create a new item for your vendor&apos;s
                  menu
               </Text>
               <CreateProductForm vendor={vendor} categories={categories} />
            </Drawer.Body>
            <Drawer.Footer>
               <Drawer.Close asChild>
                  <Button variant="secondary">Cancel</Button>
               </Drawer.Close>
               <Button type="submit" form="create-product">
                  Save
               </Button>
            </Drawer.Footer>
         </Drawer.Content>
      </Drawer>
   );
}
