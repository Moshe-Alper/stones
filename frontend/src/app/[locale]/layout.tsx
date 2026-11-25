import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Frank_Ruhl_Libre, Heebo, Noto_Sans, Noto_Serif } from "next/font/google";
import { routing } from "@/i18n/routing";
import { CONTACT_DETAILS } from "@/data/contact";
import WhatsAppFab from "@/components/WhatsAppFab/WhatsAppFab";
import "../globals.css";

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl-libre",
  subsets: ["hebrew", "latin"],
  weight: "variable",
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: "variable",
});

// Neither Frank Ruhl Libre nor Heebo ships a Cyrillic subset (confirmed against
// Next's Google Fonts metadata) — Noto Serif/Sans cover `ru` instead, swapped in
// via the `html:lang(ru)` rule in globals.css. See .plan/017 decision #2.
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["cyrillic", "latin"],
  weight: "variable",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["cyrillic", "latin"],
  weight: "variable",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const tServiceArea = await getTranslations({ locale, namespace: "ServiceArea" });

  return {
    title: t("title"),
    description: t("description", { areaSummary: tServiceArea("summary") }),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const tServiceArea = await getTranslations({ locale, namespace: "ServiceArea" });

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: t("businessName"),
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_DETAILS.addressLine,
      addressCountry: "IL",
    },
    areaServed: tServiceArea.raw("towns") as string[],
    telephone: CONTACT_DETAILS.directPhone,
    email: CONTACT_DETAILS.email,
  };

  return (
    <html
      lang={locale}
      dir={locale === "he" ? "rtl" : "ltr"}
      className={`${frankRuhlLibre.variable} ${heebo.variable} ${notoSerif.variable} ${notoSans.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <NextIntlClientProvider>
          {children}
          <WhatsAppFab />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
