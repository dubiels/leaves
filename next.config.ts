import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/leaves',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
