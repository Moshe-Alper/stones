"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import styles from "./LanguageSwitcher.module.css"

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className={styles.switcher} role="group" aria-label={t("ariaLabel")}>
      {routing.locales.map((loc, index) => (
        <span key={loc} className={styles.item}>
          {index > 0 && (
            <span className={styles.separator} aria-hidden="true">
              |
            </span>
          )}
          <button
            type="button"
            className={loc === locale ? `${styles.option} ${styles.optionActive}` : styles.option}
            aria-current={loc === locale ? "true" : undefined}
            disabled={loc === locale}
            onClick={() => router.replace(pathname, { locale: loc })}
          >
            {t(loc)}
          </button>
        </span>
      ))}
    </div>
  )
}
