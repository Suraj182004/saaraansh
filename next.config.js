/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me'],
  },
  experimental: {
    esmExternals: true,
    // Enable better support for TypeScript path aliases
    serverComponentsExternalPackages: []
  },
};

module.exports = nextConfig; 