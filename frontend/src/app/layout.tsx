import type { Metadata } from "next";
import { Noto_Serif_Hebrew } from "next/font/google";
import "./globals.css";

// NOTE: Figma design specifies "Liberation Serif" / "Noto Serif" — Liberation
// Serif has no Hebrew glyph coverage, so we substitute Google Fonts
// "Noto Serif Hebrew" for all serif text (see .plan/001-2026-07-18-homepage.md).
const notoSerifHebrew = Noto_Serif_Hebrew({
  variable: "--font-noto-serif-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "שיש אלפר",
  description:
    "עסק משפחתי המוביל את תרבות ההנצחה בישראל, עם דגש על איכות, רגישות ועיצוב נצחי שעובר מדור לדור.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={notoSerifHebrew.variable}>
      <body>{children}</body>
    </html>
  );
}
