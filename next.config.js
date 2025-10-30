const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true, 
    domains: ['placehold.co', 'res.cloudinary.com', 'images.unsplash.com', 'cdn.pixabay.com', 'images.pexels.com', 'cdn.shopify.com', 'www.gravatar.com', 'avatars.githubusercontent.com'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', 
        pathname: '/**',
      },
    ]
   } 
};

module.exports = withPWA(nextConfig);
