// next-intl/server's getTranslations/setRequestLocale only work inside Next's
// React Server Component runtime (it sets a "react-server" export condition
// Vitest never sets, so the real package throws "not supported in Client
// Components"). Aliased in place of the real module for tests — see
// vitest.config.ts and .plan/017. Reimplements just enough of getTranslations'
// contract (explicit {locale, namespace} form) for route.ts's own use.
import he from "../../messages/he.json"
import en from "../../messages/en.json"
import ru from "../../messages/ru.json"

const CATALOGS: Record<string, Record<string, Record<string, unknown>>> = { he, en, ru }

export async function getTranslations({
  locale,
  namespace,
}: {
  locale: string
  namespace: string
}) {
  const messages = CATALOGS[locale] ?? CATALOGS.he
  const namespaceMessages = messages[namespace] ?? {}

  return function t(key: string, values?: Record<string, string | number>): string {
    const template = String(namespaceMessages[key] ?? key)
    if (!values) return template
    return Object.entries(values).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
      template,
    )
  }
}

export function setRequestLocale() {}
