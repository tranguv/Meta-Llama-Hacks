import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => [
    {
      source: "/ask-all/",
      destination: process.env.NODE_ENV === "development" ? `${process.env.NEXT_PUBLIC_MODEL_API}/ask-all/` : "/ask-all/",
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"], // Add WebP format support
  },
};

export default nextConfig;
