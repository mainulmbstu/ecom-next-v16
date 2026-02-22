/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // eslint: {
  //   dirs: ["app", "lib"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  // },
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
