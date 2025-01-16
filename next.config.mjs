/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'ALLOW-FROM https://mappingtheborder.com'
            },
            {
              key: 'Content-Security-Policy',
              value: "frame-ancestors 'self' https://mappingtheborder.com *.squarespace.com"
            },
            {
              key: 'Access-Control-Allow-Origin',
              value: 'https://mappingtheborder.com'
            }
          ],
        },
      ]
    },
    crossOrigin: 'anonymous',
    output: 'standalone'
  };
  
  export default nextConfig;