import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

// Resolve relative OG image URLs against the deployed origin so link
// previews unfurl correctly. Falls back to the Vercel-provided URL, then
// localhost for dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Structure Lab",
  description:
    "A two-person structural invention workbook for A Halloween Story.",
  openGraph: {
    title: "Structure Lab",
    description:
      "A two-person structural invention workbook for A Halloween Story.",
    siteName: "Structure Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Structure Lab",
    description:
      "A two-person structural invention workbook for A Halloween Story.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
