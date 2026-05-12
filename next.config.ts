import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
