import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this directory for local dev — the repo root
  // also has a package-lock.json, which Next.js would otherwise misdetect
  // as the root. Skip this on Vercel: its own Root Directory setting already
  // resolves this correctly, and this override causes a known Next.js 16 +
  // Turbopack path-doubling bug there (ENOENT .../.next/package.json).
  ...(process.env.VERCEL
    ? {}
    : {
        outputFileTracingRoot: path.join(__dirname),
        turbopack: {
          root: path.join(__dirname),
        },
      }),
};

export default nextConfig;
