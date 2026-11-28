import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer/Footer"
import AboutContent from "@/components/AboutContent/AboutContent"
import ProcessSteps from "@/components/ProcessSteps/ProcessSteps"
import ContactBand from "@/components/ContactBand/ContactBand"

// About page (אודות): family story since 1965, handwork and the factory (.plan/025).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "AboutPage" })
  return { title: t("metaTitle"), description: t("metaDescription") }
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <AboutContent />
        <ProcessSteps />
        <ContactBand />
      </main>
      <Footer />
    </>
  )
}
