import type { Metadata } from "next";

export const metadata: Metadata = {
   title: "Login | Cari Medical",
   description: "Order food from your favorite vendors",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return <div className="justify-center mx-auto max-w-96">{children}</div>;
}
