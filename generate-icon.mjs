/**
 * Generates app icons.
 * Run: node generate-icon.mjs
 */

import sharp from 'sharp'

const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="68%">
      <stop offset="0%" stop-color="#fff7ec"/>
      <stop offset="100%" stop-color="#f3dfb5"/>
    </radialGradient>
    <linearGradient id="bag" x1="25%" y1="5%" x2="75%" y2="100%">
      <stop offset="0%"   stop-color="#7fdc94"/>
      <stop offset="55%"  stop-color="#4eb068"/>
      <stop offset="100%" stop-color="#1f5a30"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bg)"/>

  <!-- Sparkles -->
  <g stroke="#d4a542" stroke-width="9" stroke-linecap="round" opacity="0.55">
    <line x1="848" y1="190" x2="848" y2="246"/>
    <line x1="820" y1="218" x2="876" y2="218"/>
    <line x1="828" y1="198" x2="868" y2="238"/>
    <line x1="868" y1="198" x2="828" y2="238"/>
  </g>
  <g stroke="#d4a542" stroke-width="7" stroke-linecap="round" opacity="0.42">
    <line x1="148" y1="800" x2="148" y2="846"/>
    <line x1="125" y1="823" x2="171" y2="823"/>
    <line x1="132" y1="807" x2="164" y2="839"/>
    <line x1="164" y1="807" x2="132" y2="839"/>
  </g>

  <!-- Ground shadow -->
  <ellipse cx="512" cy="930" rx="312" ry="22" fill="#8a6a3a" opacity="0.20"/>

  <!-- ═══ BAG BODY ═══ -->
  <path d="
    M 462 280
    C 376 296, 216 388, 178 584
    C 162 722, 192 836, 264 884
    Q 304 910, 360 916
    L 664 916
    Q 720 910, 760 884
    C 832 836, 862 722, 846 584
    C 808 388, 648 296, 562 280
    L 462 280
    Z
  " fill="url(#bag)"/>

  <!-- ═══ STRING KNOT — two thin ribbon loops (drawn as strokes, not blobs) ═══ -->
  <g stroke="#2e7a40" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left loop -->
    <path d="M 510 272 C 510 230, 432 196, 468 192 C 502 196, 510 232, 510 270 Z"/>
    <!-- Right loop (slightly bigger, asymmetric for hand-tied feel) -->
    <path d="M 514 272 C 514 226, 596 188, 556 184 C 520 188, 514 228, 514 270 Z"/>
  </g>

  <!-- Tie point — small dark oval where the strings cross -->
  <ellipse cx="512" cy="276" rx="22" ry="10" fill="#1f5a30"/>
  <ellipse cx="506" cy="273" rx="8" ry="2" fill="white" opacity="0.35"/>

  <!-- ═══ GOMI label ═══ -->
  <text x="512" y="640"
    text-anchor="middle"
    font-family="'Arial Black', 'Helvetica Neue', sans-serif"
    font-size="130"
    font-weight="900"
    fill="white"
    opacity="0.92"
    letter-spacing="6">GOMI</text>

  <!-- Iconic curved fold/shine -->
  <path d="M 410 800 Q 512 858, 614 800"
    stroke="white" stroke-width="16" fill="none" stroke-linecap="round" opacity="0.40"/>

  <!-- Plastic shine highlight (upper-left) -->
  <ellipse cx="350" cy="476" rx="58" ry="34"
    transform="rotate(-22 350 476)" fill="white" opacity="0.42"/>
</svg>`

const splashSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="68%">
      <stop offset="0%" stop-color="#fff7ec"/>
      <stop offset="100%" stop-color="#f3dfb5"/>
    </radialGradient>
    <linearGradient id="bag" x1="25%" y1="5%" x2="75%" y2="100%">
      <stop offset="0%"   stop-color="#7fdc94"/>
      <stop offset="55%"  stop-color="#4eb068"/>
      <stop offset="100%" stop-color="#1f5a30"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="90" fill="url(#bg)"/>
  <ellipse cx="256" cy="465" rx="156" ry="11" fill="#8a6a3a" opacity="0.20"/>
  <path d="M 231 140 C 188 148,108 194,89 292 C 81 361,96 418,132 442 Q 152 455,180 458 L 332 458 Q 360 455,380 442 C 416 418,431 361,423 292 C 404 194,324 148,281 140 Z" fill="url(#bag)"/>
  <g stroke="#2e7a40" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 254 138 C 254 116, 215 102, 233 100 C 250 102, 254 118, 254 137 Z"/>
    <path d="M 258 138 C 258 114, 297 96, 278 94 C 261 96, 258 116, 258 137 Z"/>
  </g>
  <ellipse cx="256" cy="140" rx="11" ry="5" fill="#1f5a30"/>
  <text x="256" y="320" text-anchor="middle" font-family="'Arial Black', sans-serif" font-size="65" font-weight="900" fill="white" opacity="0.92" letter-spacing="3">GOMI</text>
</svg>`

await sharp(Buffer.from(iconSVG)).resize(1024, 1024).png().toFile('assets/icon.png')
console.log('✅ assets/icon.png')

await sharp(Buffer.from(iconSVG)).resize(1024, 1024).png().toFile('assets/adaptive-icon.png')
console.log('✅ assets/adaptive-icon.png')

await sharp(Buffer.from(splashSVG)).resize(200, 200).png().toFile('assets/splash-icon.png')
console.log('✅ assets/splash-icon.png')
