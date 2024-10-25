import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'export',
  distDir: 'docs',
  basePath: '/ardor-pricing.github.io'
};

export default nextConfig;
