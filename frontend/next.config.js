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
        util: false,
        url: false,
        querystring: false,
        stream: false,
        buffer: false,
        crypto: false,
        events: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
      };

      // Alias canvas to prevent Konva from trying to load it
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        'canvas-prebuilt': false,
        'canvas-prebuilt/canvas': false,
      };

      // Add externals for canvas-related modules
      config.externals = config.externals || [];
      config.externals.push({
        canvas: 'canvas',
        'canvas-prebuilt': 'canvas-prebuilt',
      });
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