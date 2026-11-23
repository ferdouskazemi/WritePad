/**
 * فیلترهای SVG که لبه‌های سوخته، موج‌دار و آبرنگی را می‌سازند.
 * یک بار در app/layout.tsx بگذارید.
 */
export function PaperFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <filter id="paper-burn" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves={5} seed={11} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={34} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-burn-small" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={3} seed={4} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={16} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-wave" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={3} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={18} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-deckle" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={3} seed={8} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={7} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paper-bloom" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={3} seed={5} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={45} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
