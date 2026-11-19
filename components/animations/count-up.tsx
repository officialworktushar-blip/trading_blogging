"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  suffix?: string;
  label?: string;
  className?: string;
  duration?: number;
};

export function CountUp({
  value,
  suffix = "",
  label,
  className,
  duration = 1400,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, inView, reduceMotion, value]);

  return (
    <div className={className}>
      <span
        ref={ref}
        className="inline-block min-w-[3ch] font-semibold tabular-nums"
      >
        {display.toLocaleString("en-US")}
        {suffix}
      </span>
      {label ? <span className="ml-1.5 text-white/70">{label}</span> : null}
    </div>
  );
}
