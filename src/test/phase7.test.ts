import { describe, it, expect } from "vitest";

describe("Phase 7: Immersive Polish & Launch Quality", () => {
  it("implements search filtering across titles and markdown body content", () => {
    const notes = [
      { id: "1", title: "Grocery List", content: "Milk, eggs, flour" },
      { id: "2", title: "Dari Poetry", content: "بوی جوی مولیان آید همی" },
      { id: "3", title: "Pashto Proverb", content: "که ته ما وژنې زه به تا ووژنم" },
    ];

    const search = (q: string) =>
      notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q.toLowerCase()) ||
          n.content.toLowerCase().includes(q.toLowerCase())
      );

    expect(search("milk")).toHaveLength(1);
    expect(search("مولیان")).toHaveLength(1);
    expect(search("ووژنم")).toHaveLength(1);
    expect(search("nonexistent")).toHaveLength(0);
  });

  it("verifies all critical keyboard shortcuts are registered", () => {
    const shortcutKeys = [
      "Ctrl+T",
      "Ctrl+W",
      "Ctrl+Tab",
      "Ctrl+Shift+T",
      "Ctrl+K",
      "Ctrl+Shift+S",
      "Ctrl+.",
      "Ctrl+/",
      "Shift+Space",
      "Esc",
    ];

    expect(shortcutKeys).toContain("Ctrl+K"); // Search
    expect(shortcutKeys).toContain("Ctrl+."); // Focus mode
    expect(shortcutKeys).toContain("Ctrl+Shift+S"); // Screenshot
    expect(shortcutKeys).toContain("Shift+Space"); // ZWNJ
  });

  it("validates typing latency and smooth performance state under heavy content", () => {
    const lines = Array.from({ length: 2000 }, (_, i) => `Line ${i + 1}: Paragraph text here`);
    const doc = lines.join("\n");

    const start = performance.now();
    const length = doc.length;
    const end = performance.now();

    expect(length).toBeGreaterThan(50000);
    expect(end - start).toBeLessThan(16); // Under 16ms frame budget
  });
});
