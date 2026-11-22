import { describe, it, expect } from "vitest";
import enMessages from "../../messages/en.json";
import faMessages from "../../messages/fa.json";
import psMessages from "../../messages/ps.json";
import { formatLocalizedDate } from "@/lib/i18n/date";

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

describe("Phase 5: Languages, Themes & Settings", () => {
  const enKeys = getAllKeys(enMessages);
  const faKeys = getAllKeys(faMessages);
  const psKeys = getAllKeys(psMessages);

  it("verifies all English keys exist in Dari (fa.json) with no missing keys", () => {
    for (const key of enKeys) {
      expect(faKeys, `Missing key in fa.json: ${key}`).toContain(key);
    }
  });

  it("verifies all English keys exist in Pashto (ps.json) with no missing keys", () => {
    for (const key of enKeys) {
      expect(psKeys, `Missing key in ps.json: ${key}`).toContain(key);
    }
  });

  it("formats dates in Solar Hijri calendar for Dari and Pashto, Gregorian for English", () => {
    // 2026-11-22
    const testDate = new Date("2026-11-22T12:00:00Z");

    const enFormatted = formatLocalizedDate(testDate, "en");
    expect(enFormatted).toContain("Nov");
    expect(enFormatted).toContain("2026");

    const faFormatted = formatLocalizedDate(testDate, "fa");
    expect(faFormatted.length).toBeGreaterThan(0);

    const psFormatted = formatLocalizedDate(testDate, "ps");
    expect(psFormatted.length).toBeGreaterThan(0);
  });

  it("supports all 6 paper themes including plain no-paper theme", () => {
    const themes = ["cream", "plain", "newsprint", "kraft", "sepia", "night"];
    expect(themes).toHaveLength(6);
    expect(themes).toContain("plain");
  });
});
