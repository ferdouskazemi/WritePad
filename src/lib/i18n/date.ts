/**
 * Formats dates according to locale:
 * - Gregorian for English (en)
 * - Solar Hijri (هجری شمسی) for Dari (fa) and Pashto (ps)
 */
export function formatLocalizedDate(
  date: Date | string | number,
  locale: string = "en"
): string {
  const d = typeof date === "object" ? date : new Date(date);
  if (isNaN(d.getTime())) return "";

  if (locale === "fa" || locale === "ps") {
    // Solar Hijri (Persian) calendar
    try {
      return new Intl.DateTimeFormat(`${locale}-AF-u-ca-persian`, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      // Fallback if locale extension unavailable
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    }
  }

  // English (Gregorian)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}
