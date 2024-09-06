import { VendorDTO } from "@frontend/lib/types";
import { ClockSolidMini } from "@medusajs/icons";
import { Badge } from "@medusajs/ui";
import { Link } from "next-view-transitions";
import Image from "next/image";

export default function VendorCategory({
   vendors,
   categoryName,
}: {
   vendors: VendorDTO[];
   categoryName?: string;
}) {
   return (
      <div className="flex flex-col gap-4">
         <h2 className="text-2xl font-medium">
            {categoryName}Popular vendors near you
         </h2>
         <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
            {vendors.map((vendor) => (
               <Link
                  href={`vendor/${vendor.handle}`}
                  key={vendor.id}
                  className="bg-ui-bg-base rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out max-w-2xl min-w-fit">
                  {vendor.image_url && (
                     <Image
                        src={vendor.image_url}
                        alt={vendor.name}
                        className="object-cover h-48 w-full rounded-t-lg"
                        width={400}
                        height={400}
                     />
                  )}
                  <div className="flex flex-col gap-2 p-4">
                     <div className="flex justify-between">
                        <h3 className="text-xl font-medium">{vendor.name}</h3>
                        <Badge size="xsmall" className="min-w-fit">
                           <ClockSolidMini />
                           10-20 min
                        </Badge>
                     </div>
                     <p className="text-sm text-gray-500">
                        {vendor.description}
                     </p>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   );
}
