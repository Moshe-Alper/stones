import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import { CONTACT_DETAILS } from "@/data/contact"
import styles from "./page.module.css"

// Privacy policy (מדיניות פרטיות), .plan/026. The text must match what the site
// actually collects: update it (and `updated` in messages) whenever a new
// third-party script, form field or data store is added.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "PrivacyPage" })
  return { title: t("metaTitle") }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "PrivacyPage" })
  const tBreadcrumb = await getTranslations({ locale, namespace: "Breadcrumb" })
  const collectItems: string[] = t.raw("collectItems")
  const processorItems: string[] = t.raw("processorItems")
  const translationNote = t("translationNote")

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <article className={styles.container}>
          <Breadcrumb items={[{ label: tBreadcrumb("homeLabel"), href: "/" }, { label: t("title") }]} />
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.text}>{t("intro")}</p>
          {translationNote && <p className={styles.note}>{translationNote}</p>}

          <h2 className={styles.heading}>{t("whoHeading")}</h2>
          <p className={styles.text}>{t("whoText")}</p>

          <h2 className={styles.heading}>{t("collectHeading")}</h2>
          <ul className={styles.list}>
            {collectItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={styles.heading}>{t("useHeading")}</h2>
          <p className={styles.text}>{t("useText")}</p>

          <h2 className={styles.heading}>{t("processorsHeading")}</h2>
          <ul className={styles.list}>
            {processorItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className={styles.heading}>{t("storageHeading")}</h2>
          <p className={styles.text}>{t("storageText")}</p>

          <h2 className={styles.heading}>{t("cookiesHeading")}</h2>
          <p className={styles.text}>{t("cookiesText")}</p>

          <h2 className={styles.heading}>{t("rightsHeading")}</h2>
          <p className={styles.text}>{t("rightsText")}</p>

          <h2 className={styles.heading}>{t("contactHeading")}</h2>
          <dl className={styles.contact}>
            <dt>{t("contactPersonLabel")}</dt>
            <dd>{t("contactPersonName")}</dd>
            <dt>{t("addressLabel")}</dt>
            <dd lang="he" dir="rtl">
              {CONTACT_DETAILS.addressLine}
            </dd>
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
