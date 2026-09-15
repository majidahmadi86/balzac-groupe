/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // /houses became /about (commit 6). 301 keeps old links and search results working;
    // browsers carry the #cafe / #antiques / #immobilier fragment across the redirect.
    return [
      { source: "/houses", destination: "/about", statusCode: 301 },
      { source: "/fr/houses", destination: "/fr/about", statusCode: 301 },
    ];
  },
};

export default nextConfig;
