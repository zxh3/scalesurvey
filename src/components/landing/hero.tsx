"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedGridBackground } from "./animated-grid-background";

export function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center overflow-hidden pb-8"
      style={{ perspective: "1500px" }}
    >
      <AnimatedGridBackground />
      <motion.div
        className="max-w-3xl space-y-6 relative z-10"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 40, z: -100 }}
        animate={{ opacity: 1, y: 0, z: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="space-y-2"
          animate={{
            rotateX: [0, 1, 0, -1, 0],
            z: [0, 10, 0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.p
            className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Scale Survey
          </motion.p>
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            Create Surveys in Seconds
          </motion.h1>
        </motion.div>
        <motion.p
          className="text-lg text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          No sign-up required. Just create, share, and collect responses.
          <br />
          Simple, fast, and completely anonymous.
        </motion.p>
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:justify-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              z: 20,
              rotateX: 5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="text-lg h-12 px-8 min-w-[260px]"
              asChild
            >
              <Link href="/create">Create Survey</Link>
            </Button>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.05,
              z: 20,
              rotateX: 5,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-12 px-8 min-w-[260px]"
              asChild
            >
              <Link href="/access">Access Existing Survey</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
