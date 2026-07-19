import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
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
  description:
    "עסק משפחתי המוביל את תרבות ההנצחה בישראל, עם דגש על איכות, רגישות ועיצוב נצחי שעובר מדור לדור.",
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
      <body>{children}</body>
    </html>
  );
}
