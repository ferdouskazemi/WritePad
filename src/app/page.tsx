"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FilmFrame } from "@/components/paper/FilmFrame";
import { TabsProvider, useTabs } from "@/components/tabs/TabsContext";
import { TabStrip } from "@/components/tabs/TabStrip";
import { EditorView } from "@/components/editor/EditorView";
import { HoseToggle, HoseRating } from "@/components/hose";

function PadContent({
  theme,
  setTheme,
  filmEnabled,
  setFilmEnabled,
  speech,
  setSpeech,
}: {
  theme: string;
  setTheme: (t: string) => void;
  filmEnabled: boolean;
  setFilmEnabled: (v: boolean) => void;
  speech: string;
  setSpeech: (s: string) => void;
}) {
  const { activeId, activeNote, updateActiveRating } = useTabs();

  return (
    <main className="min-h-screen p-3 sm:p-6 flex flex-col max-w-6xl mx-auto">
      {/* Top bar */}
      <header className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-[var(--theme-ink)]">
            Write Pad
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-cream)] font-bold text-[var(--theme-ink-muted)]">
            1930s Edition
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme selector */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="text-xs px-2.5 py-1 rounded-md border-2 border-[var(--theme-border)] bg-[var(--theme-cream)] text-[var(--theme-ink)] font-semibold cursor-pointer outline-none"
          >
            <option value="cream">Cream Paper</option>
            <option value="newsprint">Newsprint</option>
            <option value="kraft">Kraft Paper</option>
            <option value="sepia">Sepia Reel</option>
            <option value="night">Night Reel</option>
          </select>

          <Link
            href="/lab"
            className="text-xs px-3 py-1 rounded-md border-2 border-[var(--theme-border)] bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] font-bold hover:opacity-90 shadow-sm"
          >
            Open Lab ↗
          </Link>
        </div>
      </header>

      {/* The Tab Strip and Editor Sheet */}
      <div className="flex-1 flex flex-col min-h-[580px]">
        {/* Custom Folder Tab Strip */}
        <TabStrip />

        {/* Active Note Editor */}
        <div className="flex-1 flex flex-col">
          {activeId && activeNote ? (
            <EditorView
              key={activeId}
              noteId={activeId}
              initialTitle={activeNote.title}
              initialContent={activeNote.content}
              speechLine={speech}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-center bg-[var(--theme-paper)] border-2 border-[var(--theme-border)] rounded-b-lg">
              <p className="opacity-60 text-sm">No notes open. Click + above to create a note.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls */}
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--theme-ink-muted)] px-2">
        <div className="flex items-center gap-3">
          <span>Film Effect:</span>
          <div className="inline-block scale-75 origin-left">
            <HoseToggle
              label="Film switch"
              checked={filmEnabled}
              onChange={(c) => {
                setFilmEnabled(c);
                setSpeech(c ? "Film rolling!" : "Film paused.");
              }}
              onHoseLine={setSpeech}
            />
          </div>
        </div>

        {activeNote && (
          <div className="flex items-center gap-2">
            <span>Star this note:</span>
            <div className="inline-block scale-75 origin-right">
              <HoseRating
                label="Note rating"
                value={activeNote.rating}
                onChange={(v) => {
                  updateActiveRating(v);
                  setSpeech(`Rated note ${v} stars!`);
                }}
                onHoseLine={setSpeech}
              />
            </div>
          </div>
        )}
      </footer>
    </main>
  );
}

export default function Home() {
  const [theme, setTheme] = useState("cream");
  const [filmEnabled, setFilmEnabled] = useState(true);
  const [speech, setSpeech] = useState<string>("Ready to write!");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <FilmFrame enabled={filmEnabled}>
      <TabsProvider>
        <PadContent
          theme={theme}
          setTheme={setTheme}
          filmEnabled={filmEnabled}
          setFilmEnabled={setFilmEnabled}
          speech={speech}
          setSpeech={setSpeech}
        />
      </TabsProvider>
    </FilmFrame>
  );
}
