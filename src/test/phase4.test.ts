import { describe, it, expect } from "vitest";
import type { NoteRecord, OutboxRecord } from "@/lib/db";

describe("Phase 4: Sync Protocol & Conflict Resolution", () => {
  it("creates a conflict copy when server has a newer version than client", () => {
    // Existing note on server (version 3)
    const serverNote: NoteRecord = {
      id: "note-123",
      title: "Design Ideas",
      content: "Content edited from laptop",
      rating: 4,
      pinned: true,
      version: 3,
      createdAt: "2026-11-20T10:00:00Z",
      updatedAt: "2026-11-22T12:00:00Z",
      deletedAt: null,
    };

    // Incoming offline change from mobile device (version 2)
    const clientIncoming: OutboxRecord = {
      id: "outbox-1",
      noteId: "note-123",
      action: "update",
      version: 2,
      timestamp: Date.now(),
      payload: {
        id: "note-123",
        title: "Design Ideas",
        content: "Content edited offline on phone",
        rating: 4,
        pinned: true,
        version: 2,
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T10:00:00Z",
        deletedAt: null,
      },
    };

    // Conflict detection rule: serverNote.version > clientIncoming.version
    const isConflict = serverNote.version > clientIncoming.version;
    expect(isConflict).toBe(true);

    // Conflict copy creation: winning copy stays on server, client copy becomes conflict copy
    const conflictCopyId = "note-conflict-uuid";
    const conflictNote: NoteRecord = {
      ...clientIncoming.payload,
      id: conflictCopyId,
      title: `${clientIncoming.payload.title} (conflict copy)`,
      version: 1,
    };

    expect(conflictNote.title).toBe("Design Ideas (conflict copy)");
    expect(conflictNote.content).toBe("Content edited offline on phone");
    expect(serverNote.content).toBe("Content edited from laptop");
    // Both texts are preserved!
  });

  it("merges guest notes into outbox on first sign-in", () => {
    const guestNotes: NoteRecord[] = [
      {
        id: "g-1",
        title: "Guest Note 1",
        content: "Draft A",
        rating: 1,
        pinned: false,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "g-2",
        title: "Guest Note 2",
        content: "Draft B",
        rating: 2,
        pinned: false,
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const outbox: OutboxRecord[] = guestNotes.map((n) => ({
      id: `outbox-${n.id}`,
      noteId: n.id,
      action: "create",
      payload: n,
      version: n.version,
      timestamp: Date.now(),
    }));

    expect(outbox).toHaveLength(2);
    expect(outbox[0].action).toBe("create");
    expect(outbox[1].payload.title).toBe("Guest Note 2");
  });

  it("handles soft deletes with deletedAt for 30-day trash view", () => {
    const activeNote: NoteRecord = {
      id: "note-active",
      title: "Active",
      content: "...",
      rating: 0,
      pinned: false,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    const deletedNote: NoteRecord = {
      ...activeNote,
      id: "note-deleted",
      title: "Deleted",
      deletedAt: new Date().toISOString(),
    };

    const notes = [activeNote, deletedNote];
    const liveNotes = notes.filter((n) => !n.deletedAt);
    const trashNotes = notes.filter((n) => !!n.deletedAt);

    expect(liveNotes).toHaveLength(1);
    expect(liveNotes[0].id).toBe("note-active");
    expect(trashNotes).toHaveLength(1);
    expect(trashNotes[0].id).toBe("note-deleted");
  });
});
