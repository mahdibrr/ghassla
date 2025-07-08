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
    return [
      {
        source: '/:path*',
        destination: 'https://localhost:8081/:path*',
      },
    ]
  },
}

