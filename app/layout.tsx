import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

import { RadarField } from "@/components/background/radar-field";

import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RCA Tracking System",
  description:
    "A root cause analysis record that holds the incident, its cause type, the supporting evidence, the root cause statement, and the corrective and preventive actions that follow.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plex.variable} ${plexMono.variable} ${grotesk.variable}`}
    >
      <body className="min-h-dvh w-full overflow-x-hidden bg-background text-foreground antialiased">
        <a
          href="#main"
          className="sr-only z-[80] rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>

        <RadarField />

        <div className="relative z-10 flex min-h-dvh w-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
