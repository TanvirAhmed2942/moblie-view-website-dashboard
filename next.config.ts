import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ismail4001.binarybards.online",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "204.197.173.144",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
