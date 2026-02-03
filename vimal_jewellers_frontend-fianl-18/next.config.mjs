/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.candere.com" },
      { protocol: "https", hostname: "backend.vimaljewellers.com" },
      { protocol: "https", hostname: "vimal-jewellers-test-4k3l.vercel.app" },
      { protocol: "https", hostname: "admin.vimaljewellers.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "localhost", port: "7502" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "127.0.0.1", port: "7502" },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
