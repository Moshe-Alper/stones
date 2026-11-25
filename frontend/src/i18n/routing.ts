import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["he", "en", "ru"],
  defaultLocale: "he",
  localePrefix: "as-needed",
  // Hebrew is always the default: ignore the browser's Accept-Language and the
  // locale cookie, so English/Russian only show when chosen via /en or /ru
  // (the language switcher). Owner request, .plan/021.
  localeDetection: false,
})
