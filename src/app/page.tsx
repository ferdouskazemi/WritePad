"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FilmFrame } from "@/components/paper/FilmFrame";
import { TabsProvider, useTabs } from "@/components/tabs/TabsContext";
import { TabStrip } from "@/components/tabs/TabStrip";
import { EditorView } from "@/components/editor/EditorView";
import { SyncBar } from "@/components/sync/SyncBar";
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
  const [isTyping, setIsTyping] = useState(false);

  return (
    <main
      onMouseMove={() => setIsTyping(false)}
      className="min-h-screen flex flex-col max-w-5xl mx-auto py-2 sm:py-4 px-2 sm:px-6 transition-all duration-300"
    >
      {/* Top Bar: Fades away during active typing for immersive paper feel */}
      <header
        className={`mb-2 flex flex-wrap items-center justify-between gap-2 px-2 transition-opacity duration-300 ${
          isTyping ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black font-serif text-[var(--theme-ink)]">
            Write Pad
          </h1>
          <span className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--theme-border)] bg-[var(--theme-patch)] font-bold text-[var(--theme-ink-muted)]">
            1930s Living Pad
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Selector (including Plain / No-paper theme) */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="text-xs px-2.5 py-1 rounded-md border-2 border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)] font-bold cursor-pointer outline-none shadow-sm"
          >
            <option value="cream">📜 Cream Paper</option>
            <option value="plain">⚪ Plain (بدون پس‌زمینه)</option>
            <option value="newsprint">📰 Newsprint</option>
            <option value="kraft">📦 Kraft Card</option>
            <option value="sepia">🎞 Sepia Reel</option>
            <option value="night">🌙 Night Reel</option>
          </select>

          <Link
            href="/lab"
            className="text-xs px-3 py-1 rounded-md border-2 border-[var(--theme-border)] bg-[var(--theme-patch)] text-[var(--theme-patch-ink)] font-bold hover:opacity-90 shadow-sm"
          >
            Lab ↗
          </Link>
        </div>
      </header>

      {/* Sync and Account Bar: Softly visible */}
      <div
        className={`transition-opacity duration-300 ${
          isTyping ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <SyncBar />
      </div>

      {/* Living Paper Canvas */}
      <div className="flex-1 flex flex-col min-h-[620px] bg-[var(--theme-paper)] border-2 border-[var(--theme-border)] rounded-xl shadow-[0_6px_0_var(--theme-shadow)] overflow-hidden">
        {/* Cartoon Folder Tab Strip */}
        <div
          className={`transition-opacity duration-300 ${
            isTyping ? "opacity-20 hover:opacity-100" : "opacity-100"
          }`}
        >
          <TabStrip />
        </div>

        {/* Paper Sheet Area */}
        <div className="flex-1 flex flex-col bg-[var(--theme-paper)]">
          {activeId && activeNote ? (
            <EditorView
              key={activeId}
              noteId={activeId}
              initialTitle={activeNote.title}
              initialContent={activeNote.content}
              speechLine={speech}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-12 text-center bg-[var(--theme-paper)]">
              <p className="opacity-60 text-sm">No notes open. Click + above to write on fresh paper.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls: Fades during typing */}
      <footer
        className={`mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--theme-ink-muted)] px-2 transition-opacity duration-300 ${
          isTyping ? "opacity-0" : "opacity-90"
        }`}
      >
        <div className="flex items-center gap-3">
          <span>Film Effect:</span>
          <div className="inline-block scale-75 origin-left">
            <HoseToggle
              label="Film switch"
              checked={filmEnabled && theme !== "plain"}
              disabled={theme === "plain"}
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
            <span>Rate Note:</span>
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
    <FilmFrame enabled={filmEnabled && theme !== "plain"}>
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
