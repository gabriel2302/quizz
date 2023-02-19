/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quizz-bucket.s3.amazonaws.com'
      }
    ]
  }
}

module.exports = nextConfig
