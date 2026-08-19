

/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
   async rewrites() {
    return [
      {
        source: '/yt-proxy/:path*',
        destination: 'https://youtube.com*',
      },
      {
        source: '/yt-music-proxy/:path*',
        destination: 'https://music.youtube.com*',
      },
    ];
  },
};

export default nextConfig;
