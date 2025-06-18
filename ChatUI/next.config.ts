import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Use static export for Azure Static Web Apps
  output: 'export',
  
  // Configure image optimization
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Disable trailing slashes for Azure Static Web Apps
  trailingSlash: false,
  
  // Note: We're using the src/instrumentation.ts file for OpenTelemetry
  // This works with Next.js's default instrumentation mechanism
  
  // Configure webpack for OpenTelemetry with Azure Monitor
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Required for @azure/monitor-opentelemetry-exporter to work
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback.os = false;
      config.resolve.fallback.fs = false;
      config.resolve.fallback.child_process = false;
      config.resolve.fallback.path = false;
    }
    return config;
  },
  
  // Ignore ESLint errors during build
  eslint: {
    // ESLint errors and warnings won't stop the build
    ignoreDuringBuilds: true,
  },
  
  // Ignore TypeScript errors during build
  typescript: {
    // TypeScript errors and warnings won't stop the build
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
