/**
 * Generates the social link-preview image at public/og-image.png (1200×630).
 *
 * It mirrors the Hero: the gold title, both contender medallions (reusing the
 * real Linley/Andrew avatar artwork), the moneylines, and the Dallas framing.
 *
 * This is a one-off dev/design tool — it is NOT part of the app build. To run:
 *
 *   npm i -D @resvg/resvg-js
 *   node scripts/generate-og.mjs
 *
 * Fonts (Anton + Oswald) are downloaded from Google Fonts into scripts/.og-fonts/
 * on first run (gitignored). Re-run after editing the avatars or copy below.
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(here, '.og-fonts');
const FONTS = {
  'Anton-Regular.ttf':
    'https://raw.githubusercontent.com/google/fonts/main/ofl/anton/Anton-Regular.ttf',
  'Oswald.ttf':
    'https://raw.githubusercontent.com/google/fonts/main/ofl/oswald/Oswald%5Bwght%5D.ttf',
};

async function ensureFonts() {
  if (!existsSync(fontsDir)) mkdirSync(fontsDir, { recursive: true });
  const paths = [];
  for (const [name, url] of Object.entries(FONTS)) {
    const dest = join(fontsDir, name);
    if (!existsSync(dest)) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to download ${name}: ${res.status}`);
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      console.log('downloaded', name);
    }
    paths.push(dest);
  }
  return paths;
}

/** Convert React/JSX avatar markup to plain SVG attributes. */
const jsxToSvg = (s) =>
  s
    .replace(/stopColor=/g, 'stop-color=')
    .replace(/strokeWidth=/g, 'stroke-width=')
    .replace(/strokeLinecap=/g, 'stroke-linecap=')
    .replace(/strokeLinejoin=/g, 'stroke-linejoin=')
    .replace(/fillOpacity=/g, 'fill-opacity=')
    .replace(/clipPath=/g, 'clip-path=');

const linleyInner = jsxToSvg(`
<defs>
  <linearGradient id="lin-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8d6ac" /><stop offset="1" stopColor="#ecb98c" /></linearGradient>
  <linearGradient id="lin-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#73482a" /><stop offset="1" stopColor="#46291590" /></linearGradient>
  <linearGradient id="lin-dress" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#16a472" /><stop offset="1" stopColor="#0a6043" /></linearGradient>
  <linearGradient id="lin-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3cf6b" /><stop offset="1" stopColor="#c39a2c" /></linearGradient>
  <linearGradient id="lin-spritz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb347" /><stop offset="1" stopColor="#ff7a1a" /></linearGradient>
</defs>
<ellipse cx="120" cy="114" rx="84" ry="90" fill="url(#lin-hair)" />
<path d="M54 122 C30 172 40 224 72 258 C66 216 70 162 98 138 C82 132 64 132 54 122 Z" fill="url(#lin-hair)" />
<path d="M186 122 C210 172 200 224 168 258 C174 216 170 162 142 138 C158 132 176 132 186 122 Z" fill="url(#lin-hair)" />
<path d="M120 198 C84 198 58 216 50 256 L50 280 L190 280 L190 256 C182 216 156 198 120 198 Z" fill="url(#lin-dress)" />
<path d="M120 198 C104 198 90 202 80 210 C96 232 100 258 98 280 L120 280 Z" fill="#ffffff" opacity="0.12" />
<path d="M105 160 L105 198 C105 210 135 210 135 198 L135 160 Z" fill="#e6ad7f" />
<ellipse cx="120" cy="116" rx="57" ry="63" fill="url(#lin-skin)" />
<ellipse cx="65" cy="120" rx="9" ry="13" fill="url(#lin-skin)" />
<ellipse cx="175" cy="120" rx="9" ry="13" fill="url(#lin-skin)" />
<circle cx="65" cy="138" r="8.5" fill="none" stroke="url(#lin-gold)" strokeWidth="4" />
<circle cx="175" cy="138" r="8.5" fill="none" stroke="url(#lin-gold)" strokeWidth="4" />
<ellipse cx="91" cy="132" rx="8" ry="4.5" fill="#e8908d" opacity="0.35" />
<ellipse cx="149" cy="132" rx="8" ry="4.5" fill="#e8908d" opacity="0.35" />
<path d="M89 99 Q104 92 118 98" stroke="#4a2c17" strokeWidth="3.2" fill="none" strokeLinecap="round" />
<path d="M122 98 Q136 92 151 99" stroke="#4a2c17" strokeWidth="3.2" fill="none" strokeLinecap="round" />
<g><ellipse cx="103" cy="111" rx="10.5" ry="7.5" fill="#fffaf2" /><circle cx="105" cy="111" r="5.2" fill="#5b3a22" /><circle cx="105" cy="111" r="2.3" fill="#1a1008" /><circle cx="107" cy="109" r="1.5" fill="#fff" /><path d="M92 105 Q103 100 114 105" stroke="#3a2210" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
<g><ellipse cx="137" cy="111" rx="10.5" ry="7.5" fill="#fffaf2" /><circle cx="135" cy="111" r="5.2" fill="#5b3a22" /><circle cx="135" cy="111" r="2.3" fill="#1a1008" /><circle cx="137" cy="109" r="1.5" fill="#fff" /><path d="M126 105 Q137 100 148 105" stroke="#3a2210" strokeWidth="2" fill="none" strokeLinecap="round" /></g>
<path d="M120 116 L116 130 Q120 134 125 129" stroke="#d99a6c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
<path d="M101 143 Q120 165 139 143 Q120 153 101 143 Z" fill="#8a2f3a" />
<path d="M105 145 Q120 157 135 145 Q120 150 105 145 Z" fill="#fffaf2" />
<path d="M101 143 Q120 150 139 143" stroke="#c25b6a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
<path d="M120 30 C92 31 68 52 61 99 C74 74 96 66 116 60 C119 50 119 40 120 30 Z" fill="url(#lin-hair)" />
<path d="M120 30 C148 31 172 52 179 99 C166 74 144 66 124 60 C121 50 121 40 120 30 Z" fill="url(#lin-hair)" />
<path d="M120 33 L120 55" stroke="#4a2c17" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
<path d="M72 92 C80 72 97 64 114 61" stroke="#8a5a34" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
<path d="M168 92 C160 72 143 64 126 61" stroke="#8a5a34" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.55" />
<path d="M99 176 Q120 198 141 176" stroke="url(#lin-gold)" strokeWidth="2.6" fill="none" />
<circle cx="120" cy="194" r="3.4" fill="url(#lin-gold)" />
<g><path d="M52 214 L56 258 Q56 264 62 264 L78 264 Q84 264 84 258 L88 214 Z" fill="#fff" opacity="0.18" /><path d="M55 220 L58 256 Q58 260 63 260 L77 260 Q82 260 82 256 L85 220 Z" fill="url(#lin-spritz)" /><circle cx="82" cy="212" r="8.5" fill="#ff8a1f" stroke="#ffd9a0" strokeWidth="2" /><path d="M82 204 L82 220 M74 212 L90 212" stroke="#ffd9a0" strokeWidth="1.4" /><rect x="68" y="200" width="2.6" height="34" rx="1.3" fill="#d24747" transform="rotate(9 69 217)" /></g>
`);

const andrewInner = jsxToSvg(`
<defs>
  <linearGradient id="and-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6cda3" /><stop offset="1" stopColor="#e8af83" /></linearGradient>
  <linearGradient id="and-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#cb5a22" /><stop offset="1" stopColor="#9c3d14" /></linearGradient>
  <linearGradient id="and-beer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7b733" /><stop offset="1" stopColor="#df8a08" /></linearGradient>
  <clipPath id="and-shirt"><path d="M120 198 C84 198 58 216 50 256 L50 280 L190 280 L190 256 C182 216 156 198 120 198 Z" /></clipPath>
</defs>
<g clipPath="url(#and-shirt)"><rect x="40" y="196" width="160" height="90" fill="#e9e0c8" /><rect x="40" y="204" width="160" height="10" fill="#244a72" /><rect x="40" y="224" width="160" height="10" fill="#244a72" /><rect x="40" y="244" width="160" height="10" fill="#244a72" /><rect x="40" y="264" width="160" height="10" fill="#244a72" /></g>
<path d="M101 200 Q120 214 139 200" stroke="#c8bfa6" strokeWidth="3" fill="none" />
<path d="M105 162 L105 200 C105 212 135 212 135 200 L135 162 Z" fill="#e2a87a" />
<ellipse cx="120" cy="116" rx="56" ry="62" fill="url(#and-skin)" />
<ellipse cx="66" cy="120" rx="9" ry="12" fill="url(#and-skin)" />
<ellipse cx="174" cy="120" rx="9" ry="12" fill="url(#and-skin)" />
<path d="M64 112 C62 150 82 186 120 188 C158 186 178 150 176 112 C172 140 154 156 120 156 C86 156 68 140 64 112 Z" fill="#a8431a" />
<path d="M64 112 C66 124 70 132 74 138 L74 112 Z" fill="#a8431a" />
<path d="M176 112 C174 124 170 132 166 138 L166 112 Z" fill="#a8431a" />
<path d="M103 139 Q120 134 137 139 Q133 148 120 145 Q107 148 103 139 Z" fill="#9c3d14" />
<ellipse cx="90" cy="128" rx="7" ry="4" fill="#e88a6e" opacity="0.3" />
<ellipse cx="150" cy="128" rx="7" ry="4" fill="#e88a6e" opacity="0.3" />
<path d="M90 99 Q103 92 116 97" stroke="#9c3d14" strokeWidth="3.4" fill="none" strokeLinecap="round" />
<path d="M124 97 Q137 92 150 99" stroke="#9c3d14" strokeWidth="3.4" fill="none" strokeLinecap="round" />
<g><ellipse cx="104" cy="112" rx="9.5" ry="7.5" fill="#fffaf2" /><circle cx="105" cy="112" r="4.8" fill="#7fb6d8" /><circle cx="105" cy="112" r="2.2" fill="#16222b" /><circle cx="107" cy="110" r="1.5" fill="#fff" /></g>
<g><ellipse cx="136" cy="112" rx="9.5" ry="7.5" fill="#fffaf2" /><circle cx="135" cy="112" r="4.8" fill="#7fb6d8" /><circle cx="135" cy="112" r="2.2" fill="#16222b" /><circle cx="137" cy="110" r="1.5" fill="#fff" /></g>
<path d="M120 116 L115 131 Q120 135 126 130" stroke="#d2926a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
<path d="M107 151 Q121 161 134 150" stroke="#7a3b2a" strokeWidth="3" fill="none" strokeLinecap="round" />
<path d="M62 106 C58 64 86 38 120 38 C154 38 182 64 178 106 C170 86 150 80 132 85 C127 78 113 78 108 85 C90 80 70 86 62 106 Z" fill="url(#and-hair)" />
<path d="M108 85 C112 72 128 72 132 85" stroke="#b54d1c" strokeWidth="3" fill="none" strokeLinecap="round" />
<path d="M74 92 C82 74 98 66 114 64" stroke="#d96a30" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7" />
<g><path d="M156 212 L160 264 Q160 270 167 270 L185 270 Q192 270 192 264 L196 212 Z" fill="#fff" opacity="0.18" /><path d="M160 226 L163 262 Q163 266 168 266 L184 266 Q189 266 189 262 L192 226 Z" fill="url(#and-beer)" /><ellipse cx="176" cy="221" rx="18" ry="7" fill="#fff7e6" /><ellipse cx="170" cy="219" rx="5" ry="3.5" fill="#fffefb" /><ellipse cx="183" cy="221" rx="4" ry="3" fill="#fffefb" /></g>
`);

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1322"/><stop offset="1" stop-color="#080b14"/></linearGradient>
    <linearGradient id="goldText" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d680"/><stop offset="0.55" stop-color="#d4af37"/><stop offset="1" stop-color="#b8941f"/></linearGradient>
    <linearGradient id="medallion" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b1a2b" stop-opacity="0.55"/><stop offset="0.5" stop-color="#0d1424"/><stop offset="1" stop-color="#0a0e1a"/></linearGradient>
    <radialGradient id="glowBurg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#7a1f35" stop-opacity="0.5"/><stop offset="1" stop-color="#7a1f35" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowAmber" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f59e0b" stop-opacity="0.16"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowGoldC" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#d4af37" stop-opacity="0.14"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowGreen" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#10a472" stop-opacity="0.55"/><stop offset="0.7" stop-color="#10a472" stop-opacity="0.12"/><stop offset="1" stop-color="#10a472" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowRed" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#c0392b" stop-opacity="0.55"/><stop offset="0.7" stop-color="#c0392b" stop-opacity="0.12"/><stop offset="1" stop-color="#c0392b" stop-opacity="0"/></radialGradient>
    <clipPath id="cardClip"><rect x="16" y="16" width="1168" height="598" rx="30"/></clipPath>
    <clipPath id="clipL"><circle cx="405" cy="452" r="84"/></clipPath>
    <clipPath id="clipA"><circle cx="795" cy="452" r="84"/></clipPath>
  </defs>

  <rect width="1200" height="630" fill="#070a14"/>
  <rect x="16" y="16" width="1168" height="598" rx="30" fill="url(#cardBg)"/>
  <g clip-path="url(#cardClip)">
    <ellipse cx="320" cy="150" rx="430" ry="320" fill="url(#glowBurg)"/>
    <ellipse cx="960" cy="540" rx="420" ry="300" fill="url(#glowAmber)"/>
    <ellipse cx="600" cy="205" rx="480" ry="200" fill="url(#glowGoldC)"/>
  </g>
  <rect x="16" y="16" width="1168" height="598" rx="30" fill="none" stroke="#d4af37" stroke-opacity="0.18" stroke-width="1.5"/>

  <rect x="56" y="42" width="182" height="30" rx="15" fill="#3d0f1c" stroke="#c0392b" stroke-opacity="0.5"/>
  <circle cx="78" cy="57" r="4.5" fill="#ef5350"/>
  <text x="94" y="62" font-family="Oswald" font-size="14" letter-spacing="2.5" fill="#f5ecd7">LIVE MARKET</text>
  <rect x="906" y="42" width="238" height="30" rx="15" fill="#241a0e" stroke="#d4af37" stroke-opacity="0.4"/>
  <text x="1025" y="62" text-anchor="middle" font-family="Oswald" font-size="14" letter-spacing="2.5" fill="#f0c75e">EST. TONIGHT · DALLAS</text>

  <text x="600" y="168" text-anchor="middle" font-family="Anton" font-size="78" fill="url(#goldText)">SMALL PLATES,</text>
  <text x="600" y="242" text-anchor="middle" font-family="Anton" font-size="78" fill="#f5ecd7">BIG STAKES</text>
  <text x="600" y="280" text-anchor="middle" font-family="Oswald" font-size="16" letter-spacing="3.5" fill="#f0c75e" fill-opacity="0.92">ANDREW STEPHENS FIRST DATE FUTURES EXCHANGE</text>
  <text x="600" y="311" text-anchor="middle" font-family="Oswald" font-size="20" fill="#f5ecd7" fill-opacity="0.7">A first date. A tapas place. A nation watching.</text>

  <line x1="438" y1="345" x2="492" y2="345" stroke="#d4af37" stroke-opacity="0.45"/>
  <text x="600" y="350" text-anchor="middle" font-family="Oswald" font-size="13" letter-spacing="5" fill="#cdbfa3">TONIGHT'S MATCHUP</text>
  <line x1="708" y1="345" x2="762" y2="345" stroke="#d4af37" stroke-opacity="0.45"/>

  <circle cx="405" cy="452" r="98" fill="url(#glowGreen)"/>
  <g clip-path="url(#clipL)"><circle cx="405" cy="452" r="84" fill="url(#medallion)"/><g transform="translate(323.4,345.6) scale(0.68)">${linleyInner}</g></g>
  <circle cx="405" cy="452" r="84" fill="none" stroke="#d4af37" stroke-opacity="0.6" stroke-width="3"/>

  <circle cx="795" cy="452" r="98" fill="url(#glowRed)"/>
  <g clip-path="url(#clipA)"><circle cx="795" cy="452" r="84" fill="url(#medallion)"/><g transform="translate(713.4,345.6) scale(0.68)">${andrewInner}</g></g>
  <circle cx="795" cy="452" r="84" fill="none" stroke="#d4af37" stroke-opacity="0.6" stroke-width="3"/>

  <circle cx="600" cy="442" r="34" fill="#0a0e1a" stroke="#d4af37" stroke-opacity="0.55" stroke-width="2"/>
  <text x="600" y="452" text-anchor="middle" font-family="Anton" font-size="27" fill="#f0c75e">VS</text>

  <text x="405" y="576" text-anchor="middle" font-family="Anton" font-size="31" fill="#f5ecd7">LINLEY</text>
  <text x="795" y="576" text-anchor="middle" font-family="Anton" font-size="31" fill="#f5ecd7">ANDREW</text>
  <text x="405" y="600" text-anchor="middle" font-family="Oswald" font-size="15" letter-spacing="1.5" fill="#f0c75e">THE FAVORITE · −165</text>
  <text x="795" y="600" text-anchor="middle" font-family="Oswald" font-size="15" letter-spacing="1.5" fill="#f0c75e">THE UNDERDOG · +220</text>
</svg>`;

const fontFiles = await ensureFonts();
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { fontFiles, loadSystemFonts: true, defaultFontFamily: 'Oswald' },
});
const out = join(here, '..', 'public', 'og-image.png');
writeFileSync(out, resvg.render().asPng());
console.log('wrote', out);
