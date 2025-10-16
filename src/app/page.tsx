import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scale Survey",
    description:
      "Create and share online surveys instantly with no sign-up required. Anonymous, fast, and simple survey tool with real-time results.",
    url: "https://scalesurvey.com",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "No registration required",
      "Anonymous survey creation",
      "Real-time results",
      "Multiple question types",
      "CSV export",
      "Live results viewing",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </>
  );
}
