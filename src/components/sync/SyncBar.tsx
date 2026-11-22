"use client";

import React, { useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { syncEngine, type SyncStatus } from "@/lib/sync/syncEngine";
import { HoseButton, HoseProgress, HoseProgressRef, HoseToast, HoseToastRef } from "@/components/hose";
import { db, type NoteRecord } from "@/lib/db";

export function SyncBar() {
  const { data: session, status: authStatus } = useSession();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("saved");
  const [progress, setProgress] = useState(0);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [trashNotes, setTrashNotes] = useState<NoteRecord[]>([]);

  const toastRef = useRef<HoseToastRef>(null);
  const progressRef = useRef<HoseProgressRef>(null);

  useEffect(() => {
    const unsubStatus = syncEngine.subscribeStatus((st) => setSyncStatus(st));
    const unsubProg = syncEngine.subscribeProgress((p) => {
      setProgress(p);
      progressRef.current?.set(p);
    });
    const unsubToast = syncEngine.subscribeToast((msg, short) => {
      toastRef.current?.show(msg, short);
    });

    return () => {
      unsubStatus();
      unsubProg();
      unsubToast();
    };
  }, []);

  // When user signs in, trigger guest notes merge
  useEffect(() => {
    if (authStatus === "authenticated") {
      syncEngine.mergeGuestNotes();
    }
  }, [authStatus]);

  const loadTrash = async () => {
    const all = await db.notes.toArray();
    const deleted = all.filter((n) => n.deletedAt !== null && n.deletedAt !== undefined);
    setTrashNotes(deleted);
    setShowTrashModal(true);
  };

  const restoreFromTrash = async (noteId: string) => {
    await db.notes.update(noteId, { deletedAt: null, updatedAt: new Date().toISOString() });
    const note = await db.notes.get(noteId);
    if (note) syncEngine.queueChange(note, "update");
    setTrashNotes((prev) => prev.filter((n) => n.id !== noteId));
    toastRef.current?.show("Note restored from trash!", "Restored!");
  };

  const emptyTrash = async () => {
    for (const note of trashNotes) {
      await db.notes.delete(note.id);
    }
    setTrashNotes([]);
    setShowTrashModal(false);
    toastRef.current?.show("Trash emptied.", "Emptied!");
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[var(--theme-cream)] border-2 border-[var(--theme-border)] rounded-lg text-xs text-[var(--theme-ink)] mb-3">
        {/* Sync status & thermometer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold">
            {syncStatus === "syncing" && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            )}
            {syncStatus === "synced" && (
              <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
            )}
            {syncStatus === "saved" && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            )}
            {syncStatus === "offline" && (
              <span className="w-2.5 h-2.5 rounded-full bg-gray-500" />
            )}
            <span className="capitalize">
              {syncStatus === "synced"
                ? "Synced with Google"
                : syncStatus === "saved"
                ? "Saved locally (Offline ready)"
                : syncStatus === "syncing"
                ? "Syncing in background..."
                : "Offline mode"}
            </span>
          </div>

          {/* Sync Thermometer */}
          {syncStatus === "syncing" && (
            <div className="w-24 inline-block">
              <HoseProgress ref={progressRef} label="Sync" value={progress} />
            </div>
          )}

          {/* Force Sync button */}
          <button
            type="button"
            title="Force sync now (Ctrl+S)"
            onClick={() => syncEngine.sync()}
            className="px-2 py-0.5 rounded border border-[var(--theme-border)] bg-[var(--theme-paper)] hover:bg-[var(--theme-cream)] text-[11px] font-medium"
          >
            ↻ Sync
          </button>
        </div>

        {/* Account and Trash controls */}
        <div className="flex items-center gap-3">
          {/* Trash button */}
          <button
            type="button"
            onClick={loadTrash}
            className="px-2.5 py-1 rounded border border-[var(--theme-border)] bg-[var(--theme-paper)] hover:bg-[var(--theme-cream)] text-xs font-semibold flex items-center gap-1"
          >
            🗑 Trash
          </button>

          {/* Google Auth status */}
          {authStatus === "authenticated" && session?.user ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate max-w-[120px]">
                {session.user.name || session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="px-2 py-1 rounded border border-[var(--theme-border)] bg-[var(--theme-paper)] hover:opacity-80 text-[11px]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="inline-block scale-90">
              <HoseButton onClick={() => signIn("google")}>
                Sign in with Google
              </HoseButton>
            </div>
          )}
        </div>
      </div>

      {/* Hose Toaster for Sync & Conflict Alerts */}
      <HoseToast ref={toastRef} />

      {/* Trash Modal */}
      {showTrashModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--theme-paper)] text-[var(--theme-ink)] border-3 border-[var(--theme-border)] rounded-xl p-5 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-[var(--theme-ink-faint)] pb-2 mb-3">
              <h3 className="text-base font-bold font-serif">🗑 Trash (Retained 30 Days)</h3>
              <button
                type="button"
                onClick={() => setShowTrashModal(false)}
                className="text-sm font-bold opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
              {trashNotes.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between p-2 rounded border border-[var(--theme-border)] bg-[var(--theme-cream)] text-xs"
                >
                  <span className="truncate font-semibold">{n.title || "Untitled"}</span>
                  <button
                    type="button"
                    onClick={() => restoreFromTrash(n.id)}
                    className="px-2 py-1 rounded bg-[var(--theme-paper)] border border-[var(--theme-border)] hover:bg-[var(--theme-patch)] font-bold text-[11px]"
                  >
                    Restore
                  </button>
                </div>
              ))}
              {trashNotes.length === 0 && (
                <p className="text-xs opacity-60 text-center py-6">Trash is empty.</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--theme-ink-faint)] text-xs">
              <button
                type="button"
                disabled={trashNotes.length === 0}
                onClick={emptyTrash}
                className="text-red-700 font-bold hover:underline disabled:opacity-30"
              >
                Empty Trash Permanently
              </button>
              <button
                type="button"
                onClick={() => setShowTrashModal(false)}
                className="px-3 py-1 rounded border border-[var(--theme-border)] bg-[var(--theme-cream)] font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
