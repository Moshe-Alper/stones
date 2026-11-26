import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./page.module.css"

// Accessibility statement (הצהרת נגישות) required by the accessibility regulations,
// IS 5568 level AA (.plan/024). Update `updated` in messages whenever the site is re-checked.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "AccessibilityPage" })
  return { title: t("metaTitle") }
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "AccessibilityPage" })
  const tBreadcrumb = await getTranslations({ locale, namespace: "Breadcrumb" })
  const doneItems: string[] = t.raw("doneItems")
  const limitationItems: string[] = t.raw("limitationItems")

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <article className={styles.container}>
          <Breadcrumb items={[{ label: tBreadcrumb("homeLabel"), href: "/" }, { label: t("title") }]} />
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.text}>{t("intro")}</p>

          <h2 className={styles.heading}>{t("standardHeading")}</h2>
          <p className={styles.text}>{t("standardText")}</p>

          <h2 className={styles.heading}>{t("doneHeading")}</h2>
          <ul className={styles.list}>
            {doneItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={styles.heading}>{t("checkedHeading")}</h2>
          <p className={styles.text}>{t("checkedText")}</p>

          <h2 className={styles.heading}>{t("limitationsHeading")}</h2>
          <ul className={styles.list}>
            {limitationItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={styles.heading}>{t("contactHeading")}</h2>
          <p className={styles.text}>{t("contactText")}</p>
          <dl className={styles.contact}>
            <dt>{t("contactPersonLabel")}</dt>
            <dd>{t("contactPersonName")}</dd>
            <dt>{t("phoneLabel")}</dt>
            <dd>
              <a href={CONTACT_DETAILS.phoneHref} dir="ltr">
                {CONTACT_DETAILS.directPhone}
              </a>
            </dd>
            <dt>{t("emailLabel")}</dt>
            <dd>
              <a href={`mailto:${CONTACT_DETAILS.email}`} dir="ltr">
                {CONTACT_DETAILS.email}
              </a>
            </dd>
          </dl>

          <p className={styles.updated}>{t("updated")}</p>
        </article>
      </main>
      <Footer />
    </>
  )
}
