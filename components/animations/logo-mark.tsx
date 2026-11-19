"use client";

import { motion, useReducedMotion } from "motion/react";

export function LogoMark({ size = 30 }: { size?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="8" fill="#0b1f3a" />
      <path
        d="M6 22 L12 16 L17 19 L26 9"
        stroke={reduceMotion ? "#5eead4" : "#2dd4bf"}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={reduceMotion ? undefined : "logo-line"}
      />
      <circle cx="26" cy="9" r="2.2" fill="#5eead4" />
    </svg>
  );
}

export function PageLoadBar() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-teal-400"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeOut", opacity: { delay: 0.5 } }}
    />
  );
}
