import Footer from "@frontend/components/common/footer";
import { ProfileBadge } from "@frontend/components/common/profile-badge";
import NavCart from "@frontend/components/store/cart/nav-cart";
import { retrieveUser } from "@frontend/lib/data";
import { FlyingBox, ShoppingBag } from "@medusajs/icons";
import { IconButton, Text } from "@medusajs/ui";
import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { Suspense } from "react";

export const metadata: Metadata = {
   title: "Cari Medical",
   description: "Order food from your favorite vendors",
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const user = await retrieveUser();

   return (
      <>
         <nav className="flex px-4 md:px-10 py-4 h-16 bg-ui-fg-base text-ui-fg-on-inverted justify-between items-center sticky top-0 z-40">
            <Link
               href="/"
               className="flex gap-2 items-center text-xl font-semibold hover:text-ui-bg-base-hover">
               <FlyingBox /> Cari Medical
            </Link>
            <Link
               href="https://medusajs.com/"
               className="flex gap-1 items-center txt-compact-small hover:text-ui-bg-base-hover">
               <Image
                  src="/medusa-logo.svg"
                  alt="Medusa"
                  className="h-8"
                  height={30}
                  width={30}
               />
            </Link>
            <div className="flex gap-2 items-center">
               <Suspense
                  fallback={
                     <IconButton variant="transparent">
                        <ShoppingBag />
                     </IconButton>
                  }>
                  <NavCart />
               </Suspense>
               <ProfileBadge user={user} />
            </div>
         </nav>
         <main className="flex flex-col gap-20 p-4 md:p-10 transition-all duration-150 ease-in-out min-h-[calc(100vh-8rem)]">
            {children}
         </main>
         <Footer />
      </>
   );
}
