/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('canvas', 'jsdom');
    }
    return config;
  },
  serverExternalPackages: ['pdf-parse']
};

export default nextConfig;
