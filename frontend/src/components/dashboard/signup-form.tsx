"use client";

import { signup } from "@frontend/lib/actions";
import { VendorDTO } from "@frontend/lib/types";
import { Badge, Button, Input, Label, Select } from "@medusajs/ui";
import { Link } from "next-view-transitions";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

function Submit() {
   const status = useFormStatus();

   return (
      <Button
         type="submit"
         size="large"
         className="self-end"
         isLoading={status.pending}>
         Create account
      </Button>
   );
}

const userTypes = [
   { value: "driver", label: "Driver" },
   { value: "vendor", label: "Vendor" },
];

export function SignupForm({ vendors = [] }: { vendors: VendorDTO[] }) {
   const [state, action] = useFormState(signup, { message: "" });
   const [userType, setUserType] = useState("");

   return (
      <form action={action} className="flex flex-col gap-4 max-w-96">
         <div className="flex flex-col gap-2">
            <div>
               <Select
                  name="user_type"
                  onValueChange={(value) => setUserType(value)}>
                  <Select.Trigger>
                     <Select.Value placeholder="I'm a..." />
                  </Select.Trigger>
                  <Select.Content>
                     {userTypes.map((item) => (
                        <Select.Item key={item.value} value={item.value}>
                           {item.label}
                        </Select.Item>
                     ))}
                  </Select.Content>
               </Select>
            </div>
            {userType === "vendor" && (
               <div>
                  <Select name="vendor_id">
                     <Select.Trigger>
                        <Select.Value placeholder="Select vendor" />
                     </Select.Trigger>
                     <Select.Content>
                        {vendors.map((vendor) => (
                           <Select.Item key={vendor.id} value={vendor.id}>
                              {vendor.name}
                           </Select.Item>
                        ))}
                     </Select.Content>
                  </Select>
               </div>
            )}
            <div>
               <Label htmlFor="first_name">First Name</Label>
               <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="First Name"
               />
            </div>
            <div>
               <Label htmlFor="last_name">Last Name</Label>
               <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
               />
            </div>
            <div>
               <Label htmlFor="email">Email</Label>
               <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
               />
            </div>
            <div>
               <Label htmlFor="phone">Phone</Label>
               <Input
                  id="phone"
                  name="phone"
                  type="phone"
                  placeholder="Phone"
               />
            </div>
            <div>
               <Label htmlFor="password">Password</Label>
               <Input id="password" name="password" type="password" />
            </div>
            <div>
               <Label htmlFor="repeat_password">Repeat Password</Label>
               <Input
                  id="repeat_password"
                  name="repeat_password"
                  type="password"
               />
            </div>
         </div>
         <div className="flex flex-row justify-between">
            <Link href="/login">
               <Button variant="transparent" size="large">
                  Log in
               </Button>
            </Link>
            <Submit />
         </div>
         {state?.message && (
            <Badge className="justify-center text-center">
               {state.message}
            </Badge>
         )}
      </form>
   );
}
