const BACKEND_URL =
   process.env.BACKEND_URL ||
   process.env.NEXT_PUBLIC_BACKEND_URL ||
   "http://localhost:9000";

export async function listCategories() {
   const { product_categories } = await fetch(
      `${BACKEND_URL}/store/product-categories`,
      {
         next: {
            tags: ["vendors"],
         },
         headers: {
            // Authorization: `Bearer ${token}`,
            "x-publishable-api-key":
               process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
         },
      }
   ).then((res) => res.json());

   return product_categories;
}
