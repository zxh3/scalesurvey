import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "1",
    title: "Create Your Survey",
    description:
      "Add questions, configure settings, and customize your survey. Save as draft or publish immediately.",
  },
  {
    number: "2",
    title: "Get Your Admin Code",
    description:
      "Receive a unique secret code. Save it securely - you'll need it to access and edit your survey later.",
  },
  {
    number: "3",
    title: "Share & Collect",
    description:
      "Share your unique survey URL with participants. Watch responses come in real-time.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>
        <div className="space-y-12">
          {steps.map((step, _index) => (
            <div key={step.number} className="flex gap-6 items-start">
              <Badge
                variant="outline"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold"
              >
                {step.number}
              </Badge>
              <div className="space-y-2 pt-1">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
