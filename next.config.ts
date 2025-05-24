import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
    ],
    domains: ['forum-file-storage-core.oss-cn-shanghai.aliyuncs.com'],
  },
};

export default nextConfig;
