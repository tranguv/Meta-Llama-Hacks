import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => [
    {
      source: "/",
      destination: "https://localhost:5000",
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"], // Add WebP format support
  },
};

export default nextConfig;
