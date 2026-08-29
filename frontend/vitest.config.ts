import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // Next.js resolves this to a no-op via the "react-server" export
      // condition on the server; Vitest doesn't set that condition, so
      // alias it directly to the same no-op the package ships.
      "server-only": fileURLToPath(
        new URL("./node_modules/server-only/empty.js", import.meta.url),
      ),
      // next/navigation's hooks require Next's App Router runtime, which
      // Vitest/jsdom never mounts — see src/test/next-navigation-stub.ts.
      "next/navigation": fileURLToPath(
        new URL("./src/test/next-navigation-stub.ts", import.meta.url),
      ),
      // next-intl/server's getTranslations/setRequestLocale are RSC-only —
      // see src/test/next-intl-server-stub.ts.
      "next-intl/server": fileURLToPath(
        new URL("./src/test/next-intl-server-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["node_modules", "e2e", ".next"],
    server: {
      // Without this, Vitest externalizes next-intl and Node's native (strict)
      // ESM resolver loads its compiled files directly — which fails on their
      // extensionless `next/navigation` import and skips the alias above,
      // since that's a Vite-transform-time feature. Inlining routes next-intl
      // through Vite's resolver instead, where both apply.
      deps: {
        inline: ["next-intl"],
      },
    },
  },
});
