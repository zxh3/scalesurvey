import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Scale Survey really free?",
    answer:
      "Yes, Scale Survey is 100% free to use. There are no hidden fees, no premium tiers, and no limits on the number of surveys or responses you can collect. We believe everyone should have access to simple, effective survey tools.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account or sign-up is required. Simply create your survey, and you'll receive a unique admin code to manage it. Your surveys are also stored locally in your browser for easy access from the same device.",
  },
  {
    question: "How do I share my survey with participants?",
    answer:
      "Each survey gets a unique URL that you can share via email, social media, messaging apps, or embed on your website. You can also download a QR code for easy mobile access at events or in print materials.",
  },
  {
    question: "What question types are available?",
    answer:
      "Scale Survey supports 5 question types: Single Choice (radio buttons), Multiple Choice (checkboxes), Text Response (short or long answers), Star Rating (1-5 stars), and Numeric Scale (customizable range). Each type can be marked as optional or required.",
  },
  {
    question: "Can participants see the results?",
    answer:
      "You can enable or disable live results viewing for each survey. When enabled, participants can see aggregated results after submitting their response. Results update in real-time as new responses come in.",
  },
  {
    question: "How do I export my survey data?",
    answer:
      "From your admin dashboard, you can export all responses as a CSV file for analysis in Excel, Google Sheets, or any spreadsheet software. The export includes all response data with timestamps.",
  },
];

export function FAQ() {
  // Generate FAQ schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-16 bg-muted/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-3">
            Everything you need to know about Scale Survey
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
