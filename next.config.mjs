/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: "/api/:path",
      headers: [
        {key: "Access-Control-Allow-Credentials", value: "true"},
        {key: "Access-Control-Allow-Methods", value: "GET"},
        {key: "Access-Control-Allow-Origin", value: "https://radiotunetwo.vercel.app"},
        {key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-APi-Version"}
      ]
    }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ggpht.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
  return [
    {
      source: '/yt-proxy/:path*',
      destination: 'https://www.youtube.com/:path*',
    },
    {
      source: '/yt-music-proxy/:path*',
      destination: 'https://music.youtube.com/:path*',
    },
    ];
  },
};

export default nextConfig;
