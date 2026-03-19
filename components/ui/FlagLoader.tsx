"use client";

export function FlagLoader() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading" className="flex flex-col items-center justify-center py-16">
      <div className="flag-container">
        <svg
          width="80"
          height="56"
          viewBox="0 0 80 56"
          className="flag-wave"
        >
          {/* Saffron stripe */}
          <rect x="0" y="0" width="80" height="18.67" fill="#FF9933" />
          {/* White stripe */}
          <rect x="0" y="18.67" width="80" height="18.67" fill="#FFFFFF" />
          {/* Green stripe */}
          <rect x="0" y="37.33" width="80" height="18.67" fill="#138808" />
          {/* Ashoka Chakra */}
          <circle
            cx="40"
            cy="28"
            r="7"
            fill="none"
            stroke="#000080"
            strokeWidth="1"
          />
          {/* Chakra spokes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 40 + 3 * Math.cos(angle);
            const y1 = 28 + 3 * Math.sin(angle);
            const x2 = 40 + 6.5 * Math.cos(angle);
            const y2 = 28 + 6.5 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#000080"
                strokeWidth="0.5"
              />
            );
          })}
          <circle cx="40" cy="28" r="2" fill="#000080" />
        </svg>
      </div>
      <style jsx>{`
        .flag-container {
          perspective: 200px;
        }
        .flag-wave {
          animation: wave 2s ease-in-out infinite;
          transform-origin: left center;
          filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.15));
        }
        @keyframes wave {
          0% {
            transform: rotateY(0deg) skewY(0deg);
          }
          25% {
            transform: rotateY(8deg) skewY(-2deg);
          }
          50% {
            transform: rotateY(0deg) skewY(0deg);
          }
          75% {
            transform: rotateY(-8deg) skewY(2deg);
          }
          100% {
            transform: rotateY(0deg) skewY(0deg);
          }
        }
      `}</style>
    </div>
  );
}

export function FlagSpinner({ size = 32 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        className="animate-spin"
      >
        {/* Outer ring with tricolor */}
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          strokeWidth="3"
          strokeDasharray="22 22 22"
          strokeLinecap="round"
          stroke="url(#tricolor)"
        />
        {/* Ashoka Chakra center */}
        <circle cx="16" cy="16" r="4" fill="none" stroke="#000080" strokeWidth="1" />
        <circle cx="16" cy="16" r="1.5" fill="#000080" />
        <defs>
          <linearGradient id="tricolor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <FlagLoader />
    </div>
  );
}
