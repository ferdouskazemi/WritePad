/**
 * Typography and Text Stats utilities for Persian, Pashto, and English.
 */

const RTL_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function detectDirection(text: string): "rtl" | "ltr" {
  if (!text) return "ltr";
  for (const char of text) {
    if (RTL_REGEX.test(char)) return "rtl";
    // Check if basic latin letter
    if (/[A-Za-z]/.test(char)) return "ltr";
  }
  return "ltr";
}

/**
 * Converts Latin digits (0-9) to Persian digits (۰-۹).
 */
export function toPersianDigits(text: string): string {
  return text.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[parseInt(digit, 10)]);
}

/**
 * Calculates word and character count respecting Persian ZWNJ (U+200C).
 * In Persian, "می‌روم" (with ZWNJ) is a single word.
 */
export function calculateTextStats(text: string) {
  if (!text || !text.trim()) {
    return { words: 0, characters: 0, paragraphs: 0 };
  }

  // Count paragraphs
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Characters excluding newlines
  const characters = text.replace(/\r?\n/g, "").length;

  // Words: split by whitespace, commas, periods, etc., but KEEP \u200C (ZWNJ) within words
  // Regex matches non-whitespace sequences that don't split at \u200C
  const words = (text.match(/[^\s\p{P}]+(?:\u200C[^\s\p{P}]+)*/gu) || []).length;

  return {
    words,
    characters,
    paragraphs,
  };
}
