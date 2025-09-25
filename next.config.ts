import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid failing the production build on linting generated files
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
