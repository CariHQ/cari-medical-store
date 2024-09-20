import { CartDTO } from "@medusajs/types";

const BACKEND_URL =
   process.env.BACKEND_URL ||
   process.env.NEXT_PUBLIC_BACKEND_URL ||
   "http://localhost:9000";

export async function retrieveCart(cartId: string) {
   const { cart } = (await fetch(
      `${BACKEND_URL}/store/carts/${cartId}?fields=%2Bmetadata,%2Bitems.product.thumbnail`,
      {
         next: {
            tags: ["cart"],
         },
         headers: {
            // Authorization: `Bearer ${token}`,
            "x-publishable-api-key":
               process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
         },
      }
   ).then((res) => res.json())) as { cart: CartDTO };

   return cart;
}
