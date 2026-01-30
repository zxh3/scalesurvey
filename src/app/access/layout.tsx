import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Your Survey",
  description:
    "Enter your admin code to access your survey dashboard. Manage settings, view responses, and export results.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/access",
  },
};

export default function AccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
