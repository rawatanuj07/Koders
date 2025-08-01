// components/Dots.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dots() {
  const [dots, setDots] = useState<{ left: string; top: string }[]>([]);

  useEffect(() => {
    const positions = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setDots(positions);
  }, []);

  return (
    <>
      {dots.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
          style={{ left: pos.left, top: pos.top }}
          animate={{ x: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
        />
      ))}
    </>
  );
}
