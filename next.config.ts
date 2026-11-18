import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // search, /latest and paginated category pages read content/ at request time
  outputFileTracingIncludes: { "/**": ["./content/**"] },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
