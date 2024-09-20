import AccountBadge from "@frontend/components/dashboard/account-badge";
import DeliveryColumn from "@frontend/components/dashboard/delivery-column";
import RealtimeClient from "@frontend/components/dashboard/realtime-client";
import VendorStatus from "@frontend/components/dashboard/vendor/vendor-status";
import { retrieveVendor, retrieveUser } from "@frontend/lib/data";
import { DeliveryStatus } from "@frontend/lib/types";
import { Container, Heading, StatusBadge, Text } from "@medusajs/ui";
import { Link } from "next-view-transitions";
import { notFound, redirect } from "next/navigation";

export default async function VendorDashboardPage() {
   const user = await retrieveUser();

   if (!user || !user.id.includes("resadm_")) {
      redirect("/login");
   }

   if (!user.vendor_id) {
      return notFound();
   }

   const vendorId = user.vendor_id;
   const vendor = await retrieveVendor(vendorId);
   const { name, deliveries, is_open } = vendor;

   return (
      <>
         <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
               <Heading level="h1" className="text-2xl">
                  {vendor.name} | Vendor Dashboard
               </Heading>
               <Text>View and manage your vendor&apos;s orders.</Text>
            </div>
            <Container className="grid grid-cols-1 md:grid-cols-3 p-6 md:p-8 gap-4">
               <div className="flex flex-col justify-between gap-2">
                  <Text className="font-semibold">Vendor Status</Text>
                  <div className="flex gap-2">
                     <Text>Vendor status: </Text>{" "}
                     <StatusBadge
                        color={is_open ? "green" : "red"}
                        className="flex pl-1 pr-2 py-1 gap-1 w-fit">
                        {is_open ? "Taking orders" : "Closed"}
                     </StatusBadge>
                     <VendorStatus vendor={vendor} />
                  </div>
                  <div className="flex gap-2">
                     <Text>Connection status: </Text>{" "}
                     <RealtimeClient vendorId={vendorId} />
                  </div>
               </div>
               <div className="justify-center hidden md:flex">
                  {process.env.NEXT_PUBLIC_DEMO_MODE !== "true" && (
                     <div className="flex flex-col justify-between">
                        <Text className="font-semibold">Quick actions</Text>
                        <Link
                           href="/dashboard/vendor/menu"
                           className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-sm">
                           Edit menu
                        </Link>
                        <Text
                           className="text-ui-fg-disabled text-sm"
                           aria-disabled={true}>
                           Edit settings
                        </Text>
                        <Text
                           className="text-ui-fg-disabled text-sm"
                           aria-disabled={true}>
                           Edit profile
                        </Text>
                     </div>
                  )}
               </div>
               <div className="flex md:justify-end">
                  <AccountBadge data={vendor} type="vendor" />
               </div>
            </Container>
         </div>

         <div className="overflow-x-auto whitespace-nowrap">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-px">
               <DeliveryColumn
                  title="Incoming orders"
                  deliveries={deliveries}
                  statusFilters={[
                     DeliveryStatus.PENDING,
                     DeliveryStatus.VENDOR_ACCEPTED,
                  ]}
                  type="vendor"
               />
               <DeliveryColumn
                  title="Ready to prepare"
                  deliveries={deliveries}
                  statusFilters={[DeliveryStatus.PICKUP_CLAIMED]}
                  type="vendor"
               />
               <DeliveryColumn
                  title="Preparing"
                  deliveries={deliveries}
                  statusFilters={[DeliveryStatus.VENDOR_PREPARING]}
                  type="vendor"
               />
               <DeliveryColumn
                  title="In transit"
                  deliveries={deliveries}
                  statusFilters={[
                     DeliveryStatus.READY_FOR_PICKUP,
                     DeliveryStatus.IN_TRANSIT,
                  ]}
                  type="vendor"
               />
               <DeliveryColumn
                  title="Completed"
                  deliveries={deliveries}
                  statusFilters={[
                     DeliveryStatus.DELIVERED,
                     DeliveryStatus.VENDOR_DECLINED,
                  ]}
                  type="vendor"
               />
            </div>
         </div>
      </>
   );
}
