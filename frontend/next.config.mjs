/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      remotePatterns: [
         {
            protocol: "http",
            hostname: "localhost",
            port: "3000",
         },
         {
            protocol: "https",
            hostname: "robohash.org",
         },
         {
            protocol: "https",
            hostname: "cari-medical-store.vercel.app",
         },
         {
            protocol: "https",
            hostname: "via.placeholder.com",
         },
      ],
   },
};

export default nextConfig;
