"use client";

import { db, type NoteRecord, type OutboxRecord } from "@/lib/db";

export type SyncStatus = "offline" | "saved" | "syncing" | "synced" | "error";

export class SyncEngine {
  private lastPullTimeKey = "writepad_last_pull_time";
  private isSyncing = false;
  private statusListeners = new Set<(status: SyncStatus) => void>();
  private progressListeners = new Set<(ratio: number) => void>();
  private toastListeners = new Set<(msg: string, short?: string) => void>();
  private syncTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // Sync on focus
      window.addEventListener("focus", () => this.sync());
      // Sync on online
      window.addEventListener("online", () => this.sync());
      // Periodic sync every 30s
      this.syncTimer = setInterval(() => {
        if (navigator.onLine) this.sync();
      }, 30000);
    }
  }

  public subscribeStatus(listener: (status: SyncStatus) => void) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  public subscribeProgress(listener: (ratio: number) => void) {
    this.progressListeners.add(listener);
    return () => this.progressListeners.delete(listener);
  }

  public subscribeToast(listener: (msg: string, short?: string) => void) {
    this.toastListeners.add(listener);
    return () => this.toastListeners.delete(listener);
  }

  private notifyStatus(status: SyncStatus) {
    this.statusListeners.forEach((l) => l(status));
  }

  private notifyProgress(ratio: number) {
    this.progressListeners.forEach((l) => l(ratio));
  }

  private notifyToast(msg: string, short?: string) {
    this.toastListeners.forEach((l) => l(msg, short));
  }

  /**
   * Queue a local change to the Dexie outbox
   */
  public async queueChange(note: NoteRecord, action: "create" | "update" | "delete" = "update") {
    const outboxItem: OutboxRecord = {
      id: crypto.randomUUID(),
      noteId: note.id,
      action,
      payload: note,
      version: note.version,
      timestamp: Date.now(),
    };
    await db.outbox.put(outboxItem);
    this.notifyStatus("saved");
  }

  /**
   * Merge guest notes when user signs in with Google
   */
  public async mergeGuestNotes() {
    const allLocalNotes = await db.notes.toArray();
    if (allLocalNotes.length === 0) return;

    for (const note of allLocalNotes) {
      await this.queueChange(note, "create");
    }

    this.notifyToast(
      `Merged ${allLocalNotes.length} notes into your account!`,
      "Merged!"
    );
    await this.sync();
  }

  /**
   * Run sync cycle with /api/sync
   */
  public async sync(): Promise<boolean> {
    if (typeof window === "undefined" || !navigator.onLine) {
      this.notifyStatus("offline");
      return false;
    }

    if (this.isSyncing) return false;
    this.isSyncing = true;
    this.notifyStatus("syncing");
    this.notifyProgress(0.15);

    try {
      const outbox = await db.outbox.toArray();
      const lastPullTime = localStorage.getItem(this.lastPullTimeKey) || undefined;
      this.notifyProgress(0.4);

      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outbox, lastPullTime }),
      });

      if (res.status === 401) {
        // User not logged in (guest mode): local-first, no error
        this.notifyStatus("saved");
        this.notifyProgress(1);
        this.isSyncing = false;
        return false;
      }

      if (!res.ok) {
        throw new Error(`Sync failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      this.notifyProgress(0.75);

      // Clean outbox items that were pushed
      if (outbox.length > 0) {
        await db.outbox.bulkDelete(outbox.map((o) => o.id));
      }

      // Apply pulled notes to Dexie
      if (data.pulledNotes && data.pulledNotes.length > 0) {
        for (const pulled of data.pulledNotes as NoteRecord[]) {
          const local = await db.notes.get(pulled.id);
          if (!local || local.version <= pulled.version) {
            await db.notes.put(pulled);
          } else if (local.version > pulled.version) {
            // Local has newer changes not pushed yet, keep local
          }
        }
      }

      // Notify if conflict copies were created
      if (data.conflictCopiesCount > 0) {
        this.notifyToast(
          `${data.conflictCopiesCount} conflict copies created to protect your notes.`,
          "Conflict!"
        );
      }

      if (data.serverTime) {
        localStorage.setItem(this.lastPullTimeKey, data.serverTime);
      }

      this.notifyProgress(1);
      this.notifyStatus("synced");
      this.isSyncing = false;
      return true;
    } catch (err) {
      console.warn("Sync error:", err);
      this.notifyStatus("saved");
      this.isSyncing = false;
      return false;
    }
  }

  public destroy() {
    if (this.syncTimer) clearInterval(this.syncTimer);
  }
}

export const syncEngine = new SyncEngine();
