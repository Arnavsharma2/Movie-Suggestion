/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['m.media-amazon.com', 'image.tmdb.org'],
  },
}

module.exports = nextConfig
