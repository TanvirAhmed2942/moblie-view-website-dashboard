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
        hostname: "10.10.7.103",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.gopassit.org",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
