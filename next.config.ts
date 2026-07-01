import type { NextConfig } from "next";

function getApiImageRemotePatterns() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) return [];

  try {
    const url = new URL(apiBaseUrl);
    const patterns = [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/storage/**",
      },
    ];

    if (url.hostname === "localhost" && url.port) {
      patterns.push({
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: undefined,
        pathname: "/storage/**",
      });
    }

    return patterns;
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: getApiImageRemotePatterns(),
  },
};

export default nextConfig;
