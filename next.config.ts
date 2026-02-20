import type { NextConfig } from "next";

const parseRemotePattern = (raw?: string) => {
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
    };
  } catch {
    return null;
  }
};

const backendImagePattern = parseRemotePattern(
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL,
);

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "csc-frontend-lx7q9s-679d88-31-42-189-58.traefik.me",
        port: "443",
      },
      ...(backendImagePattern ? [backendImagePattern] : []),
    ],
  },
};

export default nextConfig;
