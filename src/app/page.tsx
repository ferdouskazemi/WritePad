"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FilmFrame } from "@/components/paper/FilmFrame";
import { EditorView } from "@/components/editor/EditorView";
import { HoseToggle, HoseRating } from "@/components/hose";

export default function Home() {
  const [theme, setTheme] = useState("cream");
  const [filmEnabled, setFilmEnabled] = useState(true);
  const [speech, setSpeech] = useState<string>("Ready to write!");
  const [rating, setRating] = useState(3);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <FilmFrame enabled={filmEnabled}>
      <main className="min-h-screen p-3 sm:p-6 flex flex-col max-w-6xl mx-auto">
        {/* Top bar */}
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-[var(--theme-ink)]">
              Write Pad
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-cream)] font-bold text-[var(--theme-ink-muted)]">
              1930s Edition
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick theme selector */}
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

        {/* The Notepad Living Sheet */}
        <div className="flex-1 min-h-[580px] flex flex-col">
          <EditorView speechLine={speech} />
        </div>

        {/* Footer controls */}
        <footer className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--theme-ink-muted)] px-2">
          <div className="flex items-center gap-3">
            <span>Living Cartoon Controls:</span>
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

          <div className="flex items-center gap-2">
            <span>Star this note:</span>
            <div className="inline-block scale-75 origin-right">
              <HoseRating
                label="Note rating"
                value={rating}
                onChange={(v) => {
                  setRating(v);
                  setSpeech(`Rated note ${v} stars!`);
                }}
                onHoseLine={setSpeech}
              />
            </div>
          </div>
        </footer>
      </main>
    </FilmFrame>
  );
}
