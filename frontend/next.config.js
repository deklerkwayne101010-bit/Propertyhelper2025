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
      // Create a mock canvas module for Konva
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^canvas$/,
          'node_modules/konva/lib/Global.js'
        )
      );

      // Provide a mock for canvas when imported from konva
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

      // Alias canvas to a mock implementation
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: 'konva/lib/Global.js',
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