/**
 * Stylized vector portrait of Linley — long wavy brunette hair, emerald satin
 * dress, gold hoops + chain, holding a spritz with an orange garnish. Composed,
 * confident, in control of the board.
 *
 * This is a placeholder illustration. To use a custom image instead, drop a file
 * at `public/assets/linley-avatar.png` — <Avatar /> will prefer it automatically.
 */
export function LinleyAvatar({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 280"
      className={className}
      role="img"
      aria-label="Cartoon portrait of Linley"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <linearGradient id="lin-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8d6ac" />
          <stop offset="1" stopColor="#ecb98c" />
        </linearGradient>
        <linearGradient id="lin-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#73482a" />
          <stop offset="1" stopColor="#46291590" />
        </linearGradient>
        <linearGradient id="lin-dress" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16a472" />
          <stop offset="1" stopColor="#0a6043" />
        </linearGradient>
        <linearGradient id="lin-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3cf6b" />
          <stop offset="1" stopColor="#c39a2c" />
        </linearGradient>
        <linearGradient id="lin-spritz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff7a1a" />
        </linearGradient>
      </defs>

      {/* ---- Back hair: big volume + two long wavy locks ---- */}
      <ellipse cx="120" cy="114" rx="84" ry="90" fill="url(#lin-hair)" />
      <path
        d="M54 122 C30 172 40 224 72 258 C66 216 70 162 98 138 C82 132 64 132 54 122 Z"
        fill="url(#lin-hair)"
      />
      <path
        d="M186 122 C210 172 200 224 168 258 C174 216 170 162 142 138 C158 132 176 132 186 122 Z"
        fill="url(#lin-hair)"
      />

      {/* ---- Shoulders / emerald satin dress ---- */}
      <path
        d="M120 198 C84 198 58 216 50 256 L50 280 L190 280 L190 256 C182 216 156 198 120 198 Z"
        fill="url(#lin-dress)"
      />
      <path
        d="M120 198 C104 198 90 202 80 210 C96 232 100 258 98 280 L120 280 Z"
        fill="#ffffff"
        opacity="0.12"
      />

      {/* ---- Neck ---- */}
      <path d="M105 160 L105 198 C105 210 135 210 135 198 L135 160 Z" fill="#e6ad7f" />

      {/* ---- Head ---- */}
      <ellipse cx="120" cy="116" rx="57" ry="63" fill="url(#lin-skin)" />

      {/* ---- Ears + gold hoop earrings ---- */}
      <ellipse cx="65" cy="120" rx="9" ry="13" fill="url(#lin-skin)" />
      <ellipse cx="175" cy="120" rx="9" ry="13" fill="url(#lin-skin)" />
      <circle cx="65" cy="138" r="8.5" fill="none" stroke="url(#lin-gold)" strokeWidth="4" />
      <circle cx="175" cy="138" r="8.5" fill="none" stroke="url(#lin-gold)" strokeWidth="4" />

      {/* ---- Cheeks ---- */}
      <ellipse cx="91" cy="132" rx="8" ry="4.5" fill="#e8908d" opacity="0.35" />
      <ellipse cx="149" cy="132" rx="8" ry="4.5" fill="#e8908d" opacity="0.35" />

      {/* ---- Eyebrows ---- */}
      <path d="M89 99 Q104 92 118 98" stroke="#4a2c17" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M122 98 Q136 92 151 99" stroke="#4a2c17" strokeWidth="3.2" fill="none" strokeLinecap="round" />

      {/* ---- Eyes (warm brown, confident) ---- */}
      <g>
        <ellipse cx="103" cy="111" rx="10.5" ry="7.5" fill="#fffaf2" />
        <circle cx="105" cy="111" r="5.2" fill="#5b3a22" />
        <circle cx="105" cy="111" r="2.3" fill="#1a1008" />
        <circle cx="107" cy="109" r="1.5" fill="#fff" />
        <path d="M92 105 Q103 100 114 105" stroke="#3a2210" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g>
        <ellipse cx="137" cy="111" rx="10.5" ry="7.5" fill="#fffaf2" />
        <circle cx="135" cy="111" r="5.2" fill="#5b3a22" />
        <circle cx="135" cy="111" r="2.3" fill="#1a1008" />
        <circle cx="137" cy="109" r="1.5" fill="#fff" />
        <path d="M126 105 Q137 100 148 105" stroke="#3a2210" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* ---- Nose ---- */}
      <path d="M120 116 L116 130 Q120 134 125 129" stroke="#d99a6c" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* ---- Bright confident smile with teeth ---- */}
      <path d="M101 143 Q120 165 139 143 Q120 153 101 143 Z" fill="#8a2f3a" />
      <path d="M105 145 Q120 157 135 145 Q120 150 105 145 Z" fill="#fffaf2" />
      <path d="M101 143 Q120 150 139 143" stroke="#c25b6a" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* ---- Front hair: smooth center-part sweeps framing the forehead ---- */}
      <path
        d="M120 30 C92 31 68 52 61 99 C74 74 96 66 116 60 C119 50 119 40 120 30 Z"
        fill="url(#lin-hair)"
      />
      <path
        d="M120 30 C148 31 172 52 179 99 C166 74 144 66 124 60 C121 50 121 40 120 30 Z"
        fill="url(#lin-hair)"
      />
      {/* soft center part + highlight strands */}
      <path d="M120 33 L120 55" stroke="#4a2c17" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M72 92 C80 72 97 64 114 61" stroke="#8a5a34" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M168 92 C160 72 143 64 126 61" stroke="#8a5a34" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />

      {/* ---- Gold chain necklace ---- */}
      <path d="M99 176 Q120 198 141 176" stroke="url(#lin-gold)" strokeWidth="2.6" fill="none" />
      <circle cx="120" cy="194" r="3.4" fill="url(#lin-gold)" />

      {/* ---- Spritz cocktail with orange garnish (held, front-left) ---- */}
      <g>
        <path d="M52 214 L56 258 Q56 264 62 264 L78 264 Q84 264 84 258 L88 214 Z" fill="#fff" opacity="0.18" />
        <path d="M55 220 L58 256 Q58 260 63 260 L77 260 Q82 260 82 256 L85 220 Z" fill="url(#lin-spritz)" />
        <circle cx="82" cy="212" r="8.5" fill="#ff8a1f" stroke="#ffd9a0" strokeWidth="2" />
        <path d="M82 204 L82 220 M74 212 L90 212" stroke="#ffd9a0" strokeWidth="1.4" />
        <rect x="68" y="200" width="2.6" height="34" rx="1.3" fill="#d24747" transform="rotate(9 69 217)" />
      </g>
    </svg>
  );
}
