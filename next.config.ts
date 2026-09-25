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
      {
        source: "/worker",
        destination: "/partner",
        permanent: false,
      },
      {
        source: "/partner-portal",
        destination: "/partner",
        permanent: false,
      },
      {
        source: "/partners",
        destination: "/partner",
        permanent: false,
      },
      {
        source: "/admin-portal",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/ops",
        destination: "/admin",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
