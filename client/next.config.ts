import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // your Cloudinary host
        port: '',                     // optional
        pathname: '/**',              // allow all paths
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',  // if you still need YouTube images
      },
    ],
  },
};

export default nextConfig;
