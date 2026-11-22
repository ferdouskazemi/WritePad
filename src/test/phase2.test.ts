import { describe, it, expect } from "vitest";
import {
  detectDirection,
  toPersianDigits,
  calculateTextStats,
} from "@/lib/markdown/textStats";
import { type NoteRecord } from "@/lib/db";

describe("Phase 2: Editor logic & multilingual typography", () => {
  it("detects text direction correctly for English and Persian/Pashto", () => {
    expect(detectDirection("Hello world")).toBe("ltr");
    expect(detectDirection("دفتر یادداشت")).toBe("rtl");
    expect(detectDirection("ټول افغان")).toBe("rtl");
    expect(detectDirection("Write Pad یادداشت")).toBe("ltr"); // Starts with Latin
    expect(detectDirection("یادداشت Write Pad")).toBe("rtl"); // Starts with Persian
  });

  it("converts Latin digits to Persian digits correctly", () => {
    expect(toPersianDigits("1234567890")).toBe("۱۲۳۴۵۶۷۸۹۰");
    expect(toPersianDigits("Version 1.2")).toBe("Version ۱.۲");
  });

  it("handles Persian Zero-Width Non-Joiner (ZWNJ U+200C) in word count correctly", () => {
    // "می‌روم" contains \u200C and should count as ONE word, not two
    const withZwnj = "من به خانه می‌روم";
    const withoutZwnj = "من به خانه می روم"; // separated by space

    const statsWithZwnj = calculateTextStats(withZwnj);
    const statsWithoutZwnj = calculateTextStats(withoutZwnj);

    expect(statsWithZwnj.words).toBe(4); // من, به, خانه, می‌روم
    expect(statsWithoutZwnj.words).toBe(5); // من, به, خانه, می, روم
  });

  it("calculates stats correctly for mixed Dari/Pashto and English notes", () => {
    const text = `# Title\n\nEnglish paragraph.\n\nیادداشت فارسی با ارقام ۱۲۳\n\nټول افغان`;
    const stats = calculateTextStats(text);
    expect(stats.paragraphs).toBe(4);
    expect(stats.words).toBeGreaterThan(5);
    expect(stats.characters).toBeGreaterThan(20);
  });

  it("supports Dexie NoteRecord schema with full markdown attributes", () => {
    const note: NoteRecord = {
      id: "test-note-1",
      title: "Test Note",
      content: "# Head\n\n- [ ] Task item\n- Bullet",
      rating: 5,
      pinned: true,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      editorMode: "rich",
      textDirection: "auto",
    };

    expect(note.id).toBe("test-note-1");
    expect(note.editorMode).toBe("rich");
    expect(note.rating).toBe(5);
  });
});
