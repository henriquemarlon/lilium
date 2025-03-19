/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3034',
        pathname: '/get_preimage/**',
      },
    ],
  },
};

module.exports = nextConfig;
