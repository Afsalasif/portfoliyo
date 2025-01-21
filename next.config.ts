import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["aceternity.com","images.unsplash.com"], // Add allowed domains for external images
  },
};

export default nextConfig;
