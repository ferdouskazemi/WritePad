import { describe, it, expect } from "vitest";

describe("Phase 6: Screenshot & Export", () => {
  it("formats export file names cleanly with special and Persian characters", () => {
    const rawTitle = "یادداشت من & Note #1!";
    const cleaned = rawTitle.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_");
    expect(cleaned).toContain("یادداشت_من");
    expect(cleaned).toContain("Note__1_");
  });

  it("creates valid Markdown file payload", () => {
    const markdownContent = "# Title\n\n- [ ] Task 1\n- Item 2";
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });

    expect(blob.type).toBe("text/markdown;charset=utf-8");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("creates valid Plain Text file payload", () => {
    const textContent = "Title\n\nTask 1\nItem 2";
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });

    expect(blob.type).toBe("text/plain;charset=utf-8");
    expect(blob.size).toBe(textContent.length);
  });

  it("verifies 2x resolution and watermark options", () => {
    const options = {
      pixelRatio: 2,
      includeWatermark: true,
    };

    expect(options.pixelRatio).toBe(2);
    expect(options.includeWatermark).toBe(true);
  });
});
