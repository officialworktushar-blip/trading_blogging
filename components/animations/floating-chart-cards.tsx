"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const volumes = [28, 46, 34, 62, 44, 74, 52, 88, 60, 70];

export function FloatingChartCards() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yOne = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const yTwo = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const yThree = useTransform(scrollYProgress, [0, 1], [16, -16]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative mx-auto h-[320px] w-full max-w-[380px]"
    >
      <motion.div
        style={{ y: reduceMotion ? 0 : yOne }}
        className="absolute left-0 top-4 w-44 float-y"
      >
        <div className="rounded-xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
            Trend
          </p>
          <svg viewBox="0 0 160 52" className="mt-2 h-12 w-full" fill="none">
            <path
              d="M2 42 L24 34 L46 38 L68 22 L90 28 L112 14 L134 18 L158 6"
              stroke="#5eead4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-1 text-[11px] font-medium text-teal-300">
            +2.4% this week
          </p>
        </div>
      </motion.div>

      <motion.div
        style={{ y: reduceMotion ? 0 : yTwo }}
        className="float-y float-y-delayed absolute right-0 top-24 w-40"
      >
        <div className="rounded-xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
            Momentum · RSI
          </p>
          <div className="mt-2 flex items-center justify-between">
            <svg viewBox="0 0 80 44" className="h-11 w-20" fill="none">
              <path
                d="M8 40 A32 32 0 0 1 72 40"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="M8 40 A32 32 0 0 1 62 14"
                stroke="#2dd4bf"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="40"
                x2="61"
                y2="17"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xl font-semibold tabular-nums text-white">
              62
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: reduceMotion ? 0 : yThree }}
        className="absolute bottom-2 left-8 w-52"
      >
        <div className="rounded-xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
            Volume
          </p>
          <div className="mt-2 flex h-12 items-end gap-1.5">
            {volumes.map((height, index) => (
              <span
                key={index}
                className={`w-full rounded-sm ${
                  index % 3 === 0 ? "bg-teal-300" : "bg-white/25"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <p className="mt-1 text-[11px] text-white/60">
            Session average · illustrative
          </p>
        </div>
      </motion.div>
    </div>
  );
}
