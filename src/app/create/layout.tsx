import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Free Survey",
  description:
    "Build your survey in seconds with our drag-and-drop builder. 5 question types including multiple choice, rating scales, and text responses. No account required.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    title: "Create a Free Survey | Scale Survey",
    description:
      "Build your survey in seconds with our drag-and-drop builder. 5 question types, real-time results, no sign-up required.",
    url: "/create",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
