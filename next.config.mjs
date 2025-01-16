/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async rewrites() {
      return {
        beforeFiles: [
          {
            source: '/:path*',
            has: [
              {
                type: 'header',
                key: 'referer',
                value: '(?<referer>.*)',
              },
            ],
            destination: '/:path*',
          },
        ],
      }
    }
  };
  
  export default nextConfig;