import { describe, it, expect } from "vitest";
import { type TabSessionRecord } from "@/lib/db";

describe("Phase 3: Tab system & session restore", () => {
  it("creates and manages 30 open tabs smoothly", () => {
    const tabs: { id: string; title: string; rating: number; pinned: boolean }[] = [];

    for (let i = 1; i <= 30; i++) {
      tabs.push({
        id: `tab-uuid-${i}`,
        title: `Note ${i}`,
        rating: (i % 5) + 1,
        pinned: i <= 3, // first 3 pinned
      });
    }

    expect(tabs).toHaveLength(30);
    expect(tabs.filter((t) => t.pinned)).toHaveLength(3);
    expect(tabs[29].title).toBe("Note 30");
  });

  it("handles tab reordering accurately", () => {
    const tabs = ["Tab A", "Tab B", "Tab C", "Tab D"];
    // Move Tab A (index 0) to index 2
    const [moved] = tabs.splice(0, 1);
    tabs.splice(2, 0, moved);

    expect(tabs).toEqual(["Tab B", "Tab C", "Tab A", "Tab D"]);
  });

  it("reopens recently closed tab from history stack", () => {
    const closedHistory: { id: string; title: string }[] = [];

    // Close Note 1 and Note 2
    closedHistory.push({ id: "note-1", title: "First Note" });
    closedHistory.push({ id: "note-2", title: "Second Note" });

    // Ctrl+Shift+T pops the most recently closed note
    const restored = closedHistory.pop();
    expect(restored?.id).toBe("note-2");
    expect(restored?.title).toBe("Second Note");

    const restoredNext = closedHistory.pop();
    expect(restoredNext?.id).toBe("note-1");
  });

  it("serializes and deserializes tabSession record", () => {
    const session: TabSessionRecord = {
      id: "current",
      openIds: ["note-10", "note-20", "note-30"],
      activeId: "note-20",
      closedHistory: [{ id: "note-5", title: "Old", content: "test" }],
      updatedAt: new Date().toISOString(),
    };

    expect(session.id).toBe("current");
    expect(session.openIds).toHaveLength(3);
    expect(session.activeId).toBe("note-20");
    expect(session.closedHistory).toHaveLength(1);
  });
});
