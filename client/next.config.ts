import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  rewrites: async () => [
    {
      source: "/",
      destination: "https://localhost:5000",
    },
  ],
};

export default nextConfig;
