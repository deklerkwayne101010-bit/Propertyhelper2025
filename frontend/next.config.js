/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    // Prevent Konva from loading Node.js canvas in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };

      // Alias canvas to prevent Konva from trying to load it
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig