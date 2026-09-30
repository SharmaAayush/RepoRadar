export default function Logo({ showText = true, showSubText = true, showIcon = true, size = 24 }) {
  return (<>
    <div className="inline-flex items-center gap-3 selection:bg-[var(--accent-subtle)] font-sans">
      {/* SVG Icon Graphic Mark */}
      {showIcon && (
        <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>

          {/* Decorative Concentric Scanning Radar Pulse Rings */}
          <div className="absolute inset-0 rounded-full bg-[var(--accent)]/10 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full bg-[var(--yellow)]/5 animate-pulse" />

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_12px_var(--shadow-glow)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base Radar Grid Track Lines */}
            <circle cx="50" cy="50" r="42" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="26" stroke="var(--bg-elevated-5)" strokeWidth="1.5" />

            {/* Sweeping Radar Scanner Line */}
            <line x1="50" y1="50" x2="80" y2="20" stroke="url(#radarGradient)" strokeWidth="3" strokeLinecap="round" className="origin-[50px_50px] animate-[spin_4s_linear_infinite]" />

            {/* Git Branching Repository Framework Structure */}
            {/* Paths connecting nodes */}
            <path d="M50 78 V50" stroke="var(--text-secondary)" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 50 C50 40 32 42 32 30" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 50 C50 40 68 42 68 30" stroke="var(--yellow)" strokeWidth="3" strokeLinecap="round" />

            {/* Base Anchor Target Point */}
            <circle cx="50" cy="78" r="6" fill="var(--text-secondary)" stroke="var(--bg-elevated)" strokeWidth="2" />

            {/* Monitored Discovery Signal Nodes */}
            <circle cx="32" cy="30" r="7" fill="var(--accent)" stroke="var(--bg-elevated)" strokeWidth="2" />
            <circle cx="68" cy="30" r="7" fill="var(--yellow)" stroke="var(--bg-elevated)" strokeWidth="2" />

            {/* Active Target Reticle Highlight Center Dot */}
            <circle cx="50" cy="50" r="4" fill="var(--text-primary)" />

            {/* Gradient System Definitions */}
            <defs>
              <linearGradient id="radarGradient" x1="50" y1="50" x2="80" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Brand Text Typography Group */}
      {showText && (
        <div className="flex flex-col tracking-tight">
          <span className="text-lg font-bold text-[var(--text-primary)] leading-none">
            Repo<span className="text-[var(--accent)]">Radar</span>
          </span>
          {showSubText && (
            <span className="text-[10px] uppercase font-semibold tracking-widest text-[var(--text-secondary)] mt-0.5">
              Insight Engine
            </span>
          )}
        </div>
      )}
    </div>
  </>)
}