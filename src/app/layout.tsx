import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserProvider } from "@/context/UserContext";
import { SmoothScrollProvider } from "@/components/animations/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Revenus passifs avec les meilleures applications`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "revenus passifs",
    "gagner de l'argent",
    "EarnApp",
    "Honeygain",
    "applications rémunératrices",
    "bande passante",
    "sondages rémunérés",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              description: siteConfig.description,
              url: siteConfig.url,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteConfig.url}/apps?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <UserProvider>
          <SmoothScrollProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </UserProvider>
      </body>
    </html>
  );
}
