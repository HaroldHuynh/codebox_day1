/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://codebox-day1-backend-lgaw8fk3f-harold-s-team.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
