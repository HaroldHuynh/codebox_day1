/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://codebox-day1-backend.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
