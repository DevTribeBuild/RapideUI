const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-font-stylesheets",
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2|svg|png|jpg|jpeg|gif|ico)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
      },
    },
    {
      urlPattern: /^https:\/\/YOUR_API_DOMAIN_HERE\/.*/i, // <<< IMPORTANT: Replace YOUR_API_DOMAIN_HERE with your actual API domain
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
      },
    },
  ],
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
