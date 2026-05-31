import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t1.gstatic.com",
        pathname: "/faviconV2/**",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        pathname: "/images/branding/**",
      },
      {
        protocol: "https",
        hostname: "play-lh.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
