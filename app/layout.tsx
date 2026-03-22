import type { Metadata } from "next";
import { Poppins, Poltawski_Nowy } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./components/i18n/LanguageProvider";
import { getServerLanguage } from "@/lib/i18n/server";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poltawskiNowy = Poltawski_Nowy({
  variable: "--font-poltawski",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Inferra | Scaling traffic with data-driven decisions",
  description: "We help brands, advertisers, and affiliates grow through performance marketing, traffic arbitrage, and advanced analytics.",
  icons: {
    icon: "/Inferra.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLanguage = await getServerLanguage();

  return (
    <html lang={initialLanguage}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BLBT382YX0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BLBT382YX0');
          `}
        </Script>
      </head>
      <body
        className={`${poppins.variable} ${poltawskiNowy.variable} antialiased font-poppins bg-[#0D0D0D] text-white`}
      >
        <LanguageProvider initialLanguage={initialLanguage}>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
