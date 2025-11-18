/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  // appDir is now the default in Next.js 14
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    }
    return config
  },
}

module.exports = nextConfig
