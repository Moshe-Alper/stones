import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { CONTACT_DETAILS, SERVICE_AREA } from "@/data/contact";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "שיש אלפר",
  description: `מובילים את תרבות ההנצחה באזור פרדס חנה-כרכור וסביבתה למעלה מ-50 שנה, עם דגש על איכות, רגישות ועיצוב נצחי. ${SERVICE_AREA.summary}.`,
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "שיש אלפר",
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT_DETAILS.addressLine,
    addressCountry: "IL",
  },
  areaServed: SERVICE_AREA.towns,
  telephone: CONTACT_DETAILS.directPhone,
  email: CONTACT_DETAILS.email,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frankRuhlLibre.variable} ${heebo.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
