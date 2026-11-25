import { vi } from "vitest"

// next-intl's Link/usePathname/useRouter (used by LanguageSwitcher and every
// component migrated to `@/i18n/navigation`) sit on top of next/navigation's
// App Router hooks, which throw outside of Next's own runtime. jsdom/Vitest
// never mounts that runtime, so stub the hooks components actually call.
// Aliased in place of the real module in vitest.config.ts (see .plan/017).
export function usePathname() {
  return "/"
}

export function useRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }
}

export function useParams() {
  return {}
}

export function useSearchParams() {
  return new URLSearchParams()
}

export function notFound(): never {
  throw new Error("notFound() called")
}

export const redirect = vi.fn()
