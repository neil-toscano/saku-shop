"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export default function SegmentedButtons() {
  const [selected, setSelected] = useState<number | null>(null);

  const buttons = [
    { label: "Hombres", url: "/gender/men" },
    { label: "Mujeres", url: "/gender/women" },
    { label: "Niños", url: "/gender/kid" },
  ];

  return (
    <div
      className="relative flex bg-white p-2 rounded-2xl w-fit gap-2"
      onMouseLeave={() => setSelected(null)}
    >
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            key="highlight"
            layout
            className="absolute top-2 bottom-2 bg-neutral-200 rounded-md"
            style={{
              left: `${selected * 110 + 8}px`,
              width: "100px",
            }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 1.0 } }}
          />
        )}
      </AnimatePresence>

      {buttons.map((item, idx) => (
        <Link key={idx} href={item.url}>
          <button
            onMouseEnter={() => setSelected(idx)}
            className="cursor-pointer relative z-9 w-[100px] py-2 text-center text-black font-medium"
          >
            {item.label}
          </button>
        </Link>
      ))}
    </div>
  );
}
