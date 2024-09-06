import VendorCategories from "@frontend/components/store/vendor/vendor-categories";
import { retrieveVendorByHandle } from "@frontend/lib/data";
import { Heading, Text } from "@medusajs/ui";
import { notFound } from "next/navigation";

export default async function VendorPage({
   params,
}: {
   params: { handle: string };
}) {
   const vendor = await retrieveVendorByHandle(params.handle);

   if (!vendor) return notFound();

   const categoryProductMap = new Map();

   vendor.products?.forEach((product) => {
      if (product.categories) {
         product.categories.forEach((category) => {
            if (categoryProductMap.has(category.id)) {
               categoryProductMap.get(category.id).products.push(product);
            } else {
               categoryProductMap.set(category.id, {
                  category_name: category.name,
                  products: [product],
               });
            }
         });
      }
   });

   return (
      <div className="flex flex-col md:gap-10 gap-2">
         <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
               <Heading level="h1" className="text-2xl">
                  {vendor.name} | Order food online
               </Heading>
               <Text>{vendor.description}</Text>
            </div>
         </div>
         <VendorCategories
            categoryProductMap={categoryProductMap}
            vendor={vendor}
         />
      </div>
   );
}
