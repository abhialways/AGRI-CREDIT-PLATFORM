/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:8080'
  }
}

module.exports = nextConfig