import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Scope Turbopack to this project directory — stops scanning parent folders
  turbopack: {
    root: __dirname,
  },

  // Scope output file tracing to this directory
  outputFileTracingRoot: __dirname,

  // Exclude large directories from file watching
  watchOptions: {
    ignored: [
      '**/node_modules/**',
      '**/.next/**',
      '**/generated/**',
      '**/prisma/**',
      '**/scripts/**',
      '**/.git/**',
      '**/public/**',
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'motion',
      'framer-motion',
    ],
  },
};

export default nextConfig;
