import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb' // or larger depending on your needs
    }
  }
};

export default nextConfig;
