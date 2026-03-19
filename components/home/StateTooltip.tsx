"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { StateInfo } from "@/lib/states-data";

interface StateTooltipProps {
  state: StateInfo;
  position: { x: number; y: number };
}

const TOOLTIP_WIDTH = 264;
const TOOLTIP_MARGIN = 16;

export function StateTooltip({ state, position }: StateTooltipProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const halfW = TOOLTIP_WIDTH / 2;
  const minX = halfW + TOOLTIP_MARGIN;
  const maxX = typeof window !== "undefined" ? window.innerWidth - halfW - TOOLTIP_MARGIN : 9999;
  const clampedX = Math.min(Math.max(position.x, minX), maxX);
  const arrowOffset = position.x - clampedX;

  const details = [
    { icon: "🏛️", label: "Capital", value: state.capital },
    { icon: "👥", label: "Population", value: state.population },
    { icon: "🗣️", label: "Language", value: state.language },
    { icon: "✨", label: "Known for", value: state.knownFor },
  ];

  const tooltip = (
    <div
      className="pointer-events-none fixed z-[9999] animate-[fadeIn_120ms_ease-out] overflow-hidden rounded-2xl"
      style={{
        width: `${TOOLTIP_WIDTH}px`,
        left: `${clampedX}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -110%)",
        boxShadow: "0 20px 40px -8px oklch(0.52 0.22 25 / 0.25), 0 4px 12px -2px oklch(0.13 0.02 30 / 0.12)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 pb-2 pt-2.5"
        style={{
          background: "linear-gradient(135deg, oklch(0.52 0.22 25) 0%, oklch(0.58 0.2 35) 100%)",
        }}
      >
        <h3 className="text-sm font-bold leading-snug text-white">
          {state.name}
        </h3>
      </div>

      {/* Details */}
      <div className="space-y-1.5 bg-white px-4 py-2.5">
        {details.map(({ icon, label, value }) => (
          <div key={label} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 text-sm leading-none">{icon}</span>
            <div>
              <span className="text-[var(--muted-foreground)]">{label}: </span>
              <span className="font-semibold text-[var(--foreground)]">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div
        className="absolute -bottom-1.5 h-3 w-3 rotate-45 bg-white"
        style={{
          left: `calc(50% + ${arrowOffset}px)`,
          transform: "translateX(-50%) rotate(45deg)",
          boxShadow: "2px 2px 4px oklch(0.52 0.22 25 / 0.1)",
        }}
        aria-hidden="true"
      />
    </div>
  );

  if (!mounted) return null;
  return createPortal(tooltip, document.body);
}
