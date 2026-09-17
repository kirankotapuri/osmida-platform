import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/kitchen-cleaning",
        destination: "/home-deep-cleaning?tab=kitchen",
        permanent: true,
      },
      {
        source: "/bathroom-cleaning",
        destination: "/home-deep-cleaning?tab=bathroom",
        permanent: true,
      },
      {
        source: "/kitchen",
        destination: "/home-deep-cleaning?tab=kitchen",
        permanent: true,
      },
      {
        source: "/bathroom",
        destination: "/home-deep-cleaning?tab=bathroom",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
