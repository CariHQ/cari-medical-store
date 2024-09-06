"use client";

import { setVendorStatus } from "@frontend/lib/actions";
import { VendorDTO } from "@frontend/lib/types";
import { Switch } from "@medusajs/ui";
import { useState } from "react";

export default function VendorStatus({ vendor }: { vendor: VendorDTO }) {
   const [isOpen, setIsOpen] = useState(vendor.is_open);

   const handleStatusChange = async () => {
      setIsOpen(!isOpen);
      await setVendorStatus(vendor.id, !isOpen);
   };

   return (
      <div className="flex items-center gap-x-2">
         <Switch
            id="manage-inventory"
            onCheckedChange={handleStatusChange}
            checked={isOpen}
         />
      </div>
   );
}
