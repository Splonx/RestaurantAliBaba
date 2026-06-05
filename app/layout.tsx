import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import PwaRegistration from "@/components/site/PwaRegistration";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  title: "Ali Baba El Jadida | Restaurant poissons & grillades",
  description:
    "Ali Baba El Jadida : restaurant de poissons, grillades et cuisine marocaine, idéal pour familles, groupes et événements.",
  keywords: [
    "restaurant El Jadida",
    "restaurant Ali Baba El Jadida",
    "poisson El Jadida",
    "grillades El Jadida",
    "restaurant familial El Jadida",
    "restaurant événement El Jadida"
  ],
  openGraph: {
    title: "Restaurant Ali Baba El Jadida",
    description:
      "Poissons, grillades et cuisine marocaine dans une adresse chaleureuse à El Jadida.",
    type: "website",
    locale: "fr_MA",
    siteName: "Restaurant Ali Baba El Jadida",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 1067,
        alt: "Table élégante dans un restaurant chaleureux"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Restaurant Ali Baba El Jadida",
    description:
      "Restaurant chaleureux et premium à El Jadida pour poissons, grillades, cuisine marocaine et événements privés."
  },
  robots: {
    index: true,
    follow: true
  },
  appleWebApp: {
    capable: true,
    title: "Ali Baba",
    statusBarStyle: "black-translucent"
  },
  icons: {
    apple: "/icons/icon-192.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
