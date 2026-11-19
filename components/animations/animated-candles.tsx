"use client";

import { motion, useReducedMotion } from "motion/react";

type Candle = {
  x: number;
  bottom: number;
  body: number;
  wick: number;
  up: boolean;
  delay: number;
};

const candles: Candle[] = [
  { x: 3, bottom: 10, body: 34, wick: 58, up: true, delay: 0 },
  { x: 11, bottom: 18, body: 52, wick: 76, up: true, delay: 0.08 },
  { x: 19, bottom: 28, body: 40, wick: 66, up: false, delay: 0.16 },
  { x: 27, bottom: 14, body: 62, wick: 84, up: false, delay: 0.24 },
  { x: 35, bottom: 24, body: 46, wick: 70, up: true, delay: 0.32 },
  { x: 43, bottom: 34, body: 36, wick: 60, up: true, delay: 0.4 },
  { x: 51, bottom: 22, body: 58, wick: 88, up: false, delay: 0.48 },
  { x: 59, bottom: 32, body: 44, wick: 68, up: true, delay: 0.56 },
  { x: 67, bottom: 40, body: 38, wick: 62, up: true, delay: 0.64 },
  { x: 75, bottom: 30, body: 54, wick: 80, up: false, delay: 0.72 },
  { x: 83, bottom: 42, body: 42, wick: 66, up: true, delay: 0.8 },
  { x: 91, bottom: 48, body: 32, wick: 56, up: true, delay: 0.88 },
];

const chartPath =
  "M0 150 C40 142 62 164 96 138 S158 92 196 112 S258 152 296 108 S354 64 392 88 S448 122 486 74 S548 48 600 30";

function CandleBar({ candle, animate }: { candle: Candle; animate: boolean }) {
  const color = candle.up ? "#16a34a" : "#dc2626";

  return (
    <div
      className="absolute bottom-0 w-[1.5%]"
      style={{ left: `${candle.x}%`, height: `${candle.bottom + 12}%` }}
    >
      <div
        className="absolute bottom-[22%] left-1/2 w-px -translate-x-1/2"
        style={{ height: candle.wick, backgroundColor: color, opacity: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[22%] left-0 w-full rounded-[2px]"
        style={{ height: candle.body, backgroundColor: color, transformOrigin: "bottom" }}
        initial={animate ? { scaleY: 0, opacity: 0 } : false}
        whileInView={animate ? { scaleY: 1, opacity: 0.85 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: candle.delay, ease: "easeOut" }}
      />
    </div>
  );
}

export function AnimatedCandles() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.16),transparent_42%)]" />
      {candles.map((candle) => (
        <CandleBar key={candle.x} candle={candle} animate={animate} />
      ))}
      <svg
        className="absolute bottom-10 left-0 h-56 w-full opacity-70"
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d={chartPath}
          stroke="#2dd4bf"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="900"
          initial={animate ? { strokeDashoffset: 900, opacity: 0 } : false}
          whileInView={animate ? { strokeDashoffset: 0, opacity: 0.9 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  );
}
