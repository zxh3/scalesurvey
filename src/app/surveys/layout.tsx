import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Surveys",
  description:
    "Access and manage all your created surveys in one place. View response counts, copy share links, and access admin dashboards.",
  alternates: {
    canonical: "/surveys",
  },
  openGraph: {
    title: "My Surveys | Scale Survey",
    description:
      "Access and manage all your created surveys in one place. View responses, share links, and manage settings.",
    url: "/surveys",
  },
};

export default function SurveysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
