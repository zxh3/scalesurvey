"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Key, Share2 } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Create Your Survey",
    description:
      "Add questions, configure settings, and customize your survey. Save as draft or publish immediately.",
    icon: FileText,
    gradient: "from-primary/90 to-primary/70",
  },
  {
    number: "2",
    title: "Get Your Admin Code",
    description:
      "Receive a unique secret code. Save it securely - you'll need it to access and edit your survey later.",
    icon: Key,
    gradient: "from-primary/80 to-primary/60",
  },
  {
    number: "3",
    title: "Share & Collect",
    description:
      "Share your unique survey URL with participants. Watch responses come in real-time.",
    icon: Share2,
    gradient: "from-primary/70 to-primary/50",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background decorative elements - more subtle */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-medium text-primary">Process</span>
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </motion.div>

        {/* Steps with connecting lines */}
        <div className="relative">
          {/* Connecting line - more subtle */}
          <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="flex gap-6 items-start group">
                    {/* Number badge with icon */}
                    <div className="relative z-10 shrink-0">
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {/* Animated gradient background - more subtle */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Badge container */}
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border/50 bg-background/90 backdrop-blur-sm">
                          <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
                        </div>

                        {/* Number indicator */}
                        <motion.div
                          className={`absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-white text-xs font-bold shadow-lg`}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                        >
                          {step.number}
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Content card */}
                    <motion.div
                      className="flex-1 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm p-6 group-hover:border-primary/30 transition-all duration-500"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {/* Arrow indicator for non-last items */}
                        {index < steps.length - 1 && (
                          <motion.div
                            className="hidden sm:block"
                            animate={{ y: [0, 5, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
                          </motion.div>
                        )}
                      </div>

                      {/* Decorative gradient on hover */}
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.a
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-primary font-medium transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
