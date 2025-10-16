import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Scale Survey - Create Free Online Surveys in Seconds",
    template: "%s | Scale Survey",
  },
  description:
    "Create and share online surveys instantly with no sign-up required. Anonymous, fast, and simple survey tool with real-time results. Start collecting responses in seconds.",
  keywords: [
    "online survey",
    "free survey",
    "survey maker",
    "create survey",
    "anonymous survey",
    "survey tool",
    "questionnaire",
    "poll creator",
    "feedback form",
    "survey builder",
    "no registration survey",
    "instant survey",
  ],
  authors: [{ name: "Scale Survey" }],
  creator: "Scale Survey",
  publisher: "Scale Survey",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://scalesurvey.com",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Scale Survey - Create Free Online Surveys in Seconds",
    description:
      "Create and share online surveys instantly with no sign-up required. Anonymous, fast, and simple survey tool with real-time results.",
    siteName: "Scale Survey",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scale Survey - Create Free Online Surveys in Seconds",
    description:
      "Create and share online surveys instantly with no sign-up required. Anonymous, fast, and simple survey tool.",
    creator: "@scalesurvey",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
