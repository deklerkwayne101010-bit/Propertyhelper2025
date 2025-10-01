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
      // Define environment variables to prevent Node.js canvas loading
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.KONVA_NO_CANVAS': JSON.stringify(true),
          'global.Canvas': 'undefined',
          'global.Image': 'undefined',
        })
      );

      // Ignore canvas module completely
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^canvas$/,
          contextRegExp: /konva/
        })
      );

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

      // Alias canvas to prevent any imports
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
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