import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => [
    {
      source: "/ask-all",
      destination: "http://195.242.13.143:8000/ask-all", // Original HTTP API
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"], // Add WebP format support
  },
};

export default nextConfig;
