const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: false,

  productionBrowserSourceMaps: false,
  optimizeFonts: false,
  swcMinify: true,

  webpack: (config, { dev }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*' },
      { protocol: 'http', hostname: '*' }
    ]
  }
}
