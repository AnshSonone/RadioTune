

/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
    remotePatterns: [
       {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Allows lh3, lh4, etc.
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ggpht.com',             // Crucial for YouTube avatar pictures
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.youtube.com',           // For video frame image sheets
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',           // For video frame image sheets
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
