import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Gera um servidor Node enxuto em .next/standalone, usado pelo Dockerfile.
  output: "standalone",
};

export default nextConfig;
