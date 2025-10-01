/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  webpack: (config, { isServer, webpack }) => {
    // Prevent Konva from loading Node.js canvas in the browser
    if (!isServer) {
      // Replace canvas imports with our mock
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^canvas$/,
          './canvas-mock.js'
        )
      );

      config.resolve.fallback = {
        ...config.resolve.fallback,
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

      // Alias other problematic modules
      config.resolve.alias = {
        ...config.resolve.alias,
        'canvas-prebuilt': false,
        'canvas-prebuilt/canvas': false,
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