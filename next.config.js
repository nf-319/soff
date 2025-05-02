const path = require('path');
const withTM = require('next-transpile-modules')([
  '@nivo/core',
  '@nivo/funnel',
  '@nivo/bar',
  '@nivo/line',
  '@nivo/pie',
  'd3-interpolate',
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  trailingSlash: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*' },
      { protocol: 'http', hostname: '*' },
    ],
  },
});
