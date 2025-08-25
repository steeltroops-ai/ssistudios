import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@heroicons/react",
      "framer-motion",
      "react-hot-toast",
      "react-icons",
    ],
    // Additional performance features
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Filesystem performance optimizations
  distDir: ".next",
  generateEtags: false,

  // Webpack optimizations for faster builds
  webpack: (config, { dev, isServer }) => {
    // Optimize filesystem access
    config.watchOptions = {
      poll: false,
      ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**", "**/out/**"],
    };

    // Reduce filesystem calls
    config.resolve.symlinks = false;

    return config;
  },

  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
      "*.png": {
        loaders: ["file-loader"],
        as: "*.js",
      },
      "*.jpg": {
        loaders: ["file-loader"],
        as: "*.js",
      },
      "*.jpeg": {
        loaders: ["file-loader"],
        as: "*.js",
      },
      "*.webp": {
        loaders: ["file-loader"],
        as: "*.js",
      },
    },
    resolveAlias: {
      "@": path.resolve("./"),
    },
  },

  // Server external packages
  serverExternalPackages: ["mongoose", "mongodb"],

  // Image optimization with aggressive settings
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression and optimization
  compress: true,
  poweredByHeader: false,

  // Output optimization
  output: "standalone",

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: any) => {
      config.plugins.push(
        new (require("@next/bundle-analyzer"))({
          enabled: true,
        })
      );
      return config;
    },
  }),
};

export default nextConfig;
