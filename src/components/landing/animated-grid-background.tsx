"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

// Separate component for a single particle
function MouseReactiveParticle({
  mouseX,
  mouseY,
  index,
  baseLeft,
  baseTop,
  magnitude,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  index: number;
  baseLeft: number;
  baseTop: number;
  magnitude: number;
}) {
  const x = useTransform(mouseX, [0, 1], [-15 * magnitude, 15 * magnitude]);
  const y = useTransform(mouseY, [0, 1], [-15 * magnitude, 15 * magnitude]);

  return (
    <motion.div
      className="absolute w-2 h-2 bg-primary/20 dark:bg-primary/15 rounded-full blur-[1px]"
      style={{
        left: `${baseLeft}%`,
        top: `${baseTop}%`,
        x,
        y,
      }}
      animate={{
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        opacity: { duration: 2 + index * 0.1, repeat: Infinity },
        scale: { duration: 2 + index * 0.1, repeat: Infinity },
      }}
    />
  );
}

// Container for mouse-reactive particles
function MouseReactiveParticles({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => {
        const baseLeft = (i % 5) * 20 + 10;
        const baseTop = Math.floor(i / 5) * 25 + 10;
        const magnitude = (i % 3) + 1;

        return (
          <MouseReactiveParticle
            key={`particle-${i}`}
            mouseX={mouseX}
            mouseY={mouseY}
            index={i}
            baseLeft={baseLeft}
            baseTop={baseTop}
            magnitude={magnitude}
          />
        );
      })}
    </>
  );
}

export function AnimatedGridBackground() {
  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation and position values
  const rotateX = useTransform(smoothMouseY, [0, 1], [2, -2]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-2, 2]);
  const lightX = useTransform(smoothMouseX, [0, 1], ["0%", "100%"]);
  const lightY = useTransform(smoothMouseY, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to 0-1 range
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Base grid pattern with 3D transform - mouse interactive */}
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"
        style={{
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
      />

      {/* Mouse-following spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 600px at ${lightX} ${lightY}, rgba(120, 119, 198, 0.2), transparent 70%)`,
        }}
      />

      {/* Traveling light beam - diagonal sweep with 3D depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 800px 400px at var(--x) var(--y), rgba(120, 119, 198, 0.1), transparent 60%)",
          transformStyle: "preserve-3d",
        }}
        animate={{
          "--x": ["-50%", "150%"],
          "--y": ["-30%", "130%"],
          z: [0, 50, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Secondary traveling light - opposite direction */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 600px 300px at var(--x) var(--y), rgba(168, 85, 247, 0.08), transparent 70%)",
        }}
        animate={{
          "--x": ["150%", "-50%"],
          "--y": ["150%", "-50%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid intersection highlights - light follows along grid lines */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, transparent 47%, rgba(120, 119, 198, 0.3) 49%, rgba(120, 119, 198, 0.3) 51%, transparent 53%),
            linear-gradient(to bottom, transparent 47%, rgba(120, 119, 198, 0.2) 49%, rgba(120, 119, 198, 0.2) 51%, transparent 53%)
          `,
          backgroundSize: "48px 48px",
          backgroundPosition: "var(--offset-x) var(--offset-y)",
        }}
        animate={{
          "--offset-x": ["0px", "48px"],
          "--offset-y": ["0px", "48px"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Mouse-reactive particles */}
      <MouseReactiveParticles mouseX={smoothMouseX} mouseY={smoothMouseY} />

      {/* Pulsing grid nodes at intersections with 3D floating */}
      {Array.from({ length: 12 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const depth = (i % 3) * 20;
        return (
          <motion.div
            key={`node-${i}`}
            className="absolute w-1 h-1 bg-primary/40 dark:bg-primary/30 rounded-full shadow-[0_0_8px_2px_rgba(120,119,198,0.3)]"
            style={{
              left: `${25 + col * 16.66}%`,
              top: `${20 + row * 20}%`,
              transformStyle: "preserve-3d",
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
              z: [depth, depth + 30, depth],
              rotateZ: [0, 180, 360],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Subtle horizontal scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] opacity-30"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(120, 119, 198, 0.4) 50%, transparent)",
          boxShadow: "0 0 20px 4px rgba(120, 119, 198, 0.3)",
        }}
        animate={{
          top: ["-5%", "105%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Ambient glow spots with 3D depth */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/10 rounded-full mix-blend-screen filter blur-3xl"
        style={{ transformStyle: "preserve-3d" }}
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1, 1.2, 1],
          z: [0, 40, 0],
          rotateX: [0, 10, 0],
          rotateY: [0, -10, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating 3D cards/planes in background */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`plane-${i}`}
          className="absolute w-32 h-32 border border-primary/10 dark:border-primary/5 rounded-lg backdrop-blur-sm"
          style={{
            left: `${15 + i * 18}%`,
            top: `${30 + (i % 2) * 25}%`,
            transformStyle: "preserve-3d",
          }}
          initial={{
            opacity: 0.1,
            rotateX: 0,
            rotateY: 0,
            z: 0,
          }}
          animate={{
            rotateX: [0, 15, 0],
            rotateY: [0, -15, 0],
            z: [0, 60, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background pointer-events-none" />
    </div>
  );
}
