"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function update() {
      const scrolled = window.scrollY;
      const total =
        document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const ratio = Math.min(1, Math.max(0, scrolled / total));
      setProgress(ratio);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-transparent"
    >
      <div
        className="reading-progress h-full bg-teal-500"
        style={{
          transform: `scaleX(${progress})`,
          transition: reduceMotion ? "none" : "transform 120ms linear",
        }}
      />
    </div>
  );
}
