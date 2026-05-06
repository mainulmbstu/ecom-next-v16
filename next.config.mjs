/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // async rewrites() {
  //    return [
  //      {
  //        source: '/api/external/:path*',
  //        destination: 'https://external-service.com*', // The real API URL
  //      },
  //    ];
  //  },
  reactCompiler: true,
  // eslint: {
  //   dirs: ["app", "lib"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  // },
  allowedDevOrigins: [
    "reprise-spied-retold.ngrok-free.dev",
    "https://ecom-next-v16.vercel.app",
    "https://sandbox.sslcommerz.com",
  ],
  cacheComponents: true,
  experimental: {
    // serverComponentsHmrCache: false,
    // defaults to true
    serverActions: {
      bodySizeLimit: "10mb",
      // allowedOrigins: ["my-proxy.com", "*.my-proxy.com"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // port: "",
        // pathname: "/**",
        // search: "",
      },
    ],
  },
  // images: {
  //   domains: ["res.cloudinary.com"],
  // },
};

export default nextConfig;
