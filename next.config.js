// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    // Only apply rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/:path*',
          destination: 'http://localhost:8081/:path*',
        },
      ]
    }
    return []
  },
}

