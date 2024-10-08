"use client";

import { VendorDTO } from "@frontend/lib/types";
import { Plus } from "@medusajs/icons";
import { Button, Drawer, Text } from "@medusajs/ui";

export function CreateCategoryDrawer({ vendor }: { vendor: VendorDTO }) {
   return (
      <Drawer>
         <Drawer.Trigger asChild>
            <Button variant="secondary" size="large">
               <Plus />
               Create Category
            </Button>
         </Drawer.Trigger>
         <Drawer.Content className="z-50">
            <Drawer.Header>
               <Drawer.Title>Creat Menu Category</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="p-4">
               <Text>
                  This is where you create a new category for your vendor&apos;s
                  menu (not implemented in this demo)
               </Text>
            </Drawer.Body>
            <Drawer.Footer>
               <Drawer.Close asChild>
                  <Button variant="secondary">Cancel</Button>
               </Drawer.Close>
               <Button>Save</Button>
            </Drawer.Footer>
         </Drawer.Content>
      </Drawer>
   );
}
