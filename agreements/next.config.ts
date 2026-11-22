import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  // The schema file is read at runtime to bootstrap the database; make sure it ships with every route.
  outputFileTracingIncludes: { "/**": ["./db/schema.sql"] },
  poweredByHeader: false,
}

export default nextConfig
