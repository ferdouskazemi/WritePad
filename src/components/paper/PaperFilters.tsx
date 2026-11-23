/**
 * فیلترهای SVG که لبه‌های سوخته، موج‌دار و آبرنگی را می‌سازند.
 * یک بار در app/layout.tsx بگذارید.
 */
export function PaperFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <filter id="paper-burn" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.022" numOctaves={2} seed={11} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={18} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-burn-small" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={1} seed={4} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={8} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-wave" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={3} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={16} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-deckle" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={8} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={6} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-bloom" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={5} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={28} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
