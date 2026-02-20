import type { Metadata } from "next";
import { Poppins, Poltawski_Nowy } from "next/font/google";
import "./globals.css";

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
    icon: "/logo.svg",
  },
};

import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poltawskiNowy.variable} antialiased font-poppins bg-[#0D0D0D] text-white`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
