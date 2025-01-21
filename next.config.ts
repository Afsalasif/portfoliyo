import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    domains: ["aceternity.com","images.unsplash.com"], // Add allowed domains for external images
  },
};

export default nextConfig;
