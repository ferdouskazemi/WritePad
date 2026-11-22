"use client";

import React, { useState, useEffect } from "react";
import { db, type NoteRecord } from "@/lib/db";
import { useTabs } from "@/components/tabs/TabsContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NoteRecord[]>([]);
  const { setActiveId, tabs, createTab } = useTabs();

  useEffect(() => {
    if (!isOpen) return;
    const search = async () => {
      const all = await db.notes.toArray();
      if (!query.trim()) {
        setResults(all.slice(0, 8));
        return;
      }
      const q = query.toLowerCase();
      const filtered = all.filter(
        (n) =>
          !n.deletedAt &&
          (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
      );
      setResults(filtered);
    };
    search();
  }, [query, isOpen]);

  if (!isOpen) return null;

  const handleSelectNote = (noteId: string) => {
    // If not in open tabs, open it
    const isOpenTab = tabs.some((t) => t.id === noteId);
    if (!isOpenTab) {
      db.notes.get(noteId).then((n) => {
        if (n) createTab(n.title, n.content);
      });
    } else {
      setActiveId(noteId);
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--theme-paper)] text-[var(--theme-ink)] border-3 border-[var(--theme-border)] rounded-2xl p-4 max-w-lg w-full shadow-2xl relative"
      >
        <div className="flex items-center gap-2 border-b-2 border-[var(--theme-border)] pb-2 mb-3">
          <span className="text-base">🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="Search all notes (titles and content)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm font-semibold placeholder:opacity-50 text-[var(--theme-ink)]"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] rounded border border-[var(--theme-border)] bg-[var(--theme-cream)] font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1.5">
          {results.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className="p-2.5 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-cream)] hover:bg-[var(--theme-patch)] cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs truncate">{note.title || "Untitled"}</span>
                {note.rating > 0 && (
                  <span className="text-[10px] text-amber-700">★{note.rating}</span>
                )}
              </div>
              <p className="text-[11px] opacity-70 truncate mt-0.5">
                {note.content.replace(/[#*`_]/g, "").slice(0, 80) || "Empty note"}
              </p>
            </div>
          ))}

          {results.length === 0 && (
            <p className="text-xs opacity-60 text-center py-8">No matching notes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
