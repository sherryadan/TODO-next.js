/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {}, // ✅ correct (must be an object)
    reactCompiler: true, // ✅ still valid
    nodeMiddleware: true,
  },
  turbopack: {
    enabled: true // ✅ new place to enable Turbopack
  }
};

export default nextConfig;
