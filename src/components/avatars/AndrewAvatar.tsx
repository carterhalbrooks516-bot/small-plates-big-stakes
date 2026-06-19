/**
 * Stylized vector portrait of Andrew — short red hair, red beard, light eyes,
 * casual striped shirt, holding a drink. Friendly, awkwardly confident, lovable
 * underdog who is trying very hard not to say anything weird.
 *
 * This is a placeholder illustration. To use a custom image instead, drop a file
 * at `public/assets/andrew-avatar.png` — <Avatar /> will prefer it automatically.
 */
export function AndrewAvatar({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 280"
      className={className}
      role="img"
      aria-label="Cartoon portrait of Andrew"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="and-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6cda3" />
          <stop offset="1" stopColor="#e8af83" />
        </linearGradient>
        <linearGradient id="and-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cb5a22" />
          <stop offset="1" stopColor="#9c3d14" />
        </linearGradient>
        <linearGradient id="and-beer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7b733" />
          <stop offset="1" stopColor="#df8a08" />
        </linearGradient>
        <clipPath id="and-shirt">
          <path d="M120 198 C84 198 58 216 50 256 L50 280 L190 280 L190 256 C182 216 156 198 120 198 Z" />
        </clipPath>
      </defs>

      {/* ---- Casual striped shirt ---- */}
      <g clipPath="url(#and-shirt)">
        <rect x="40" y="196" width="160" height="90" fill="#e9e0c8" />
        <rect x="40" y="204" width="160" height="10" fill="#244a72" />
        <rect x="40" y="224" width="160" height="10" fill="#244a72" />
        <rect x="40" y="244" width="160" height="10" fill="#244a72" />
        <rect x="40" y="264" width="160" height="10" fill="#244a72" />
      </g>
      {/* crew neckline */}
      <path d="M101 200 Q120 214 139 200" stroke="#c8bfa6" strokeWidth="3" fill="none" />

      {/* ---- Neck ---- */}
      <path d="M105 162 L105 200 C105 212 135 212 135 200 L135 162 Z" fill="#e2a87a" />

      {/* ---- Head ---- */}
      <ellipse cx="120" cy="116" rx="56" ry="62" fill="url(#and-skin)" />

      {/* ---- Ears ---- */}
      <ellipse cx="66" cy="120" rx="9" ry="12" fill="url(#and-skin)" />
      <ellipse cx="174" cy="120" rx="9" ry="12" fill="url(#and-skin)" />

      {/* ---- Red beard (jaw, chin, sideburns) + mustache ---- */}
      <path
        d="M64 112 C62 150 82 186 120 188 C158 186 178 150 176 112 C172 140 154 156 120 156 C86 156 68 140 64 112 Z"
        fill="#a8431a"
      />
      <path d="M64 112 C66 124 70 132 74 138 L74 112 Z" fill="#a8431a" />
      <path d="M176 112 C174 124 170 132 166 138 L166 112 Z" fill="#a8431a" />
      <path d="M103 139 Q120 134 137 139 Q133 148 120 145 Q107 148 103 139 Z" fill="#9c3d14" />

      {/* ---- Cheeks ---- */}
      <ellipse cx="90" cy="128" rx="7" ry="4" fill="#e88a6e" opacity="0.3" />
      <ellipse cx="150" cy="128" rx="7" ry="4" fill="#e88a6e" opacity="0.3" />

      {/* ---- Eyebrows: slightly raised, optimistic-nervous ---- */}
      <path d="M90 99 Q103 92 116 97" stroke="#9c3d14" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M124 97 Q137 92 150 99" stroke="#9c3d14" strokeWidth="3.4" fill="none" strokeLinecap="round" />

      {/* ---- Light blue eyes ---- */}
      <g>
        <ellipse cx="104" cy="112" rx="9.5" ry="7.5" fill="#fffaf2" />
        <circle cx="105" cy="112" r="4.8" fill="#7fb6d8" />
        <circle cx="105" cy="112" r="2.2" fill="#16222b" />
        <circle cx="107" cy="110" r="1.5" fill="#fff" />
      </g>
      <g>
        <ellipse cx="136" cy="112" rx="9.5" ry="7.5" fill="#fffaf2" />
        <circle cx="135" cy="112" r="4.8" fill="#7fb6d8" />
        <circle cx="135" cy="112" r="2.2" fill="#16222b" />
        <circle cx="137" cy="110" r="1.5" fill="#fff" />
      </g>

      {/* ---- Nose ---- */}
      <path d="M120 116 L115 131 Q120 135 126 130" stroke="#d2926a" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* ---- Small, slightly uneven optimistic smile ---- */}
      <path d="M107 151 Q121 161 134 150" stroke="#7a3b2a" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* ---- Short red hair on top ---- */}
      <path
        d="M62 106 C58 64 86 38 120 38 C154 38 182 64 178 106 C170 86 150 80 132 85 C127 78 113 78 108 85 C90 80 70 86 62 106 Z"
        fill="url(#and-hair)"
      />
      <path d="M108 85 C112 72 128 72 132 85" stroke="#b54d1c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M74 92 C82 74 98 66 114 64" stroke="#d96a30" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* ---- Beer in hand (front-right) ---- */}
      <g>
        <path d="M156 212 L160 264 Q160 270 167 270 L185 270 Q192 270 192 264 L196 212 Z" fill="#fff" opacity="0.18" />
        <path d="M160 226 L163 262 Q163 266 168 266 L184 266 Q189 266 189 262 L192 226 Z" fill="url(#and-beer)" />
        <ellipse cx="176" cy="221" rx="18" ry="7" fill="#fff7e6" />
        <ellipse cx="170" cy="219" rx="5" ry="3.5" fill="#fffefb" />
        <ellipse cx="183" cy="221" rx="4" ry="3" fill="#fffefb" />
      </g>
    </svg>
  );
}
