import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take Survey",
  description: "Share your feedback by completing this survey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
