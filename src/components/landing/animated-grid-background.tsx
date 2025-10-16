"use client";

import { motion } from "framer-motion";

// Seeded random function for consistent positioning
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Pre-calculate dot positions outside component to avoid hydration issues
// Round to 2 decimal places to ensure consistent rendering on server and client
const DOTS = Array.from({ length: 40 }).map((_, i) => ({
  id: `dot-${i}`, // Add unique id for stable keys
  left: Math.round(seededRandom(i * 2) * 10000) / 100,
  top: Math.round(seededRandom(i * 2 + 1) * 10000) / 100,
  duration: Math.round((3 + seededRandom(i * 3) * 3) * 100) / 100,
  delay: Math.round(seededRandom(i * 4) * 300) / 100,
}));

export function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Grid pattern with stronger lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808020_1px,transparent_1px),linear-gradient(to_bottom,#80808020_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Diagonal lines for added interest */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,#80808008_50%,transparent_52%)] bg-[size:96px_96px]" />

      {/* Subtle animated gradient orbs - matching theme colors */}
      <motion.div
        className="absolute top-0 -left-4 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/8 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-0 -right-4 w-[500px] h-[500px] bg-secondary/5 dark:bg-secondary/8 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl"
        animate={{
          x: [0, -150, 0],
          y: [0, 120, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-muted/10 dark:bg-muted/5 rounded-full mix-blend-multiply filter blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, -80, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated dots - more and larger */}
      <div className="absolute inset-0">
        {DOTS.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute w-2 h-2 bg-primary/30 dark:bg-primary/20 rounded-full"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
    </div>
  );
}
