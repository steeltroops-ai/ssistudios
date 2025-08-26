import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Performance optimizations (stable version compatible)
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
    // Stable performance features
    optimizeServerReact: true,
    webVitalsAttribution: ["CLS", "FCP", "FID", "INP", "LCP", "TTFB"],
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ["mongoose", "mongodb"],

  // Filesystem performance optimizations
  distDir: ".next",
  generateEtags: false,
  reactStrictMode: true,

  // Headers for performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Webpack optimizations for faster builds
  webpack: (config) => {
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
