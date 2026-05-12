import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: [],
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
