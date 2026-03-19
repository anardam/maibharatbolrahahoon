"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { statesData } from "@/lib/states-data";
import { StateTooltip } from "./StateTooltip";

interface IndiaMapInteractiveProps {
  locale: "hi" | "en";
  onStateHover?: (stateId: string | null) => void;
}

const DEFAULT_FILL = "oklch(0.52 0.22 25 / 0.12)";
const DEFAULT_STROKE = "oklch(0.52 0.22 25 / 0.4)";
const HOVER_FILL = "oklch(0.52 0.22 25 / 0.32)";
const HOVER_STROKE = "oklch(0.52 0.22 25 / 0.8)";
const HOVER_SHADOW = "drop-shadow(0 3px 10px oklch(0.52 0.22 25 / 0.4))";

function resetPath(el: SVGPathElement) {
  el.style.fill = DEFAULT_FILL;
  el.style.stroke = DEFAULT_STROKE;
  el.style.filter = "none";
}

function highlightPath(el: SVGPathElement) {
  el.style.fill = HOVER_FILL;
  el.style.stroke = HOVER_STROKE;
  el.style.filter = HOVER_SHADOW;
}

export function IndiaMapInteractive({ locale, onStateHover }: IndiaMapInteractiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    fetch("/india.svg")
      .then((res) => res.text())
      .then((svgText) => {
        const wrapper = container.querySelector(".map-svg-wrapper");
        if (!wrapper) return;
        wrapper.innerHTML = svgText;

        const svg = wrapper.querySelector("svg");
        if (!svg) return;

        // Add viewBox for proper scaling
        const w = svg.getAttribute("width") || "611.86";
        const h = svg.getAttribute("height") || "695.7";
        svg.setAttribute("viewBox", `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.removeAttribute("style");
        svg.style.display = "block";

        // Style all state paths
        const paths = svg.querySelectorAll("path[id]");
        paths.forEach((path) => {
          const el = path as SVGPathElement;
          el.style.fill = DEFAULT_FILL;
          el.style.stroke = DEFAULT_STROKE;
          el.style.strokeWidth = "0.9";
          el.style.transition = "fill 200ms ease, stroke 200ms ease, filter 200ms ease";
          el.style.cursor = "pointer";
        });

        setMapLoaded(true);
      });
  }, []);

  const selectState = useCallback(
    (stateId: string | null, pos: { x: number; y: number }) => {
      if (stateId === hoveredState) return;

      // Reset previous
      if (hoveredState) {
        const prev = containerRef.current?.querySelector(`#${CSS.escape(hoveredState)}`) as SVGPathElement | null;
        if (prev) resetPath(prev);
      }

      // Highlight new
      if (stateId) {
        const el = containerRef.current?.querySelector(`#${CSS.escape(stateId)}`) as SVGPathElement | null;
        if (el) highlightPath(el);
      }

      setHoveredState(stateId);
      setTooltipPos(pos);
      onStateHover?.(stateId);
    },
    [hoveredState, onStateHover]
  );

  // Mouse events (desktop)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice) return;
      const target = e.target as SVGElement;
      const pathEl = target.closest("path[id]") as SVGPathElement | null;

      if (pathEl) {
        const stateId = pathEl.getAttribute("id") || "";
        selectState(stateId, { x: e.clientX, y: e.clientY });
        // Keep updating tooltip position on same state
        if (stateId === hoveredState) {
          setTooltipPos({ x: e.clientX, y: e.clientY });
        }
      } else {
        selectState(null, { x: 0, y: 0 });
      }
    },
    [isTouchDevice, hoveredState, selectState]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isTouchDevice) {
      selectState(null, { x: 0, y: 0 });
    }
  }, [isTouchDevice, selectState]);

  // Touch events (mobile)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY) as SVGElement | null;
      const pathEl = target?.closest("path[id]") as SVGPathElement | null;

      if (pathEl) {
        const stateId = pathEl.getAttribute("id") || "";
        // Toggle: tap again to deselect
        if (stateId === hoveredState) {
          selectState(null, { x: 0, y: 0 });
        } else {
          selectState(stateId, { x: touch.clientX, y: touch.clientY });
        }
      } else {
        selectState(null, { x: 0, y: 0 });
      }
    },
    [hoveredState, selectState]
  );

  const stateInfo = hoveredState ? statesData[hoveredState] : null;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ animation: "fadeIn 600ms ease-out both" }}
    >
      <div
        className={`map-svg-wrapper w-full transition-opacity duration-500 ${mapLoaded ? "opacity-100" : "opacity-0"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      />

      {/* Loading skeleton */}
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[250px] w-[220px] animate-pulse rounded-2xl bg-[var(--muted)] lg:h-[500px] lg:w-[430px]" />
        </div>
      )}

      {/* Tooltip — only on desktop (tooltip follows cursor) */}
      {stateInfo && hoveredState && !isTouchDevice && (
        <StateTooltip
          state={stateInfo}
          position={tooltipPos}
        />
      )}

      {/* Mobile: inline state info card (shows below map area on tap) */}
      {stateInfo && hoveredState && isTouchDevice && (
        <div
          className="absolute bottom-0 left-0 right-0 animate-[fadeIn_150ms_ease-out] rounded-xl border bg-white p-3 shadow-lg"
          style={{
            borderColor: "oklch(0.91 0.015 60)",
            boxShadow: "0 -4px 20px -4px oklch(0.52 0.22 25 / 0.15)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--primary)]">
                {locale === "hi" ? stateInfo.nameHi : stateInfo.name}
              </h3>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--muted-foreground)]">
                <span>🏛️ {locale === "hi" ? stateInfo.capitalHi : stateInfo.capital}</span>
                <span>👥 {stateInfo.population}</span>
                <span>🗣️ {locale === "hi" ? stateInfo.languageHi : stateInfo.language}</span>
              </div>
            </div>
            <button
              onClick={() => selectState(null, { x: 0, y: 0 })}
              className="shrink-0 rounded-full p-1 hover:bg-[var(--muted)]"
              aria-label="Close"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
