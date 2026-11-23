"use client";

import React, { useState, useEffect } from "react";
import { TabsProvider, useTabs } from "@/components/tabs/TabsContext";
import { TabStrip } from "@/components/tabs/TabStrip";
import { EditorView } from "@/components/editor/EditorView";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { ExportModal } from "@/components/export/ExportModal";
import { SearchModal } from "@/components/search/SearchModal";
import { ShortcutsModal } from "@/components/shortcuts/ShortcutsModal";
import { I18nProvider, useI18n } from "@/lib/i18n/I18nContext";
import "@/components/paper/film.css";

function PadContent({
  theme,
  setTheme,
  filmEnabled,
  setFilmEnabled,
  paperWidth,
  setPaperWidth,
  speech,
  setSpeech,
}: {
  theme: string;
  setTheme: (t: string) => void;
  filmEnabled: boolean;
  setFilmEnabled: (v: boolean) => void;
  paperWidth: string;
  setPaperWidth: (w: string) => void;
  speech: string;
  setSpeech: (s: string) => void;
}) {
  const { activeId, activeNote } = useTabs();
  const { t } = useI18n();
  const [isTyping, setIsTyping] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K: Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Ctrl+Shift+S: Screenshot / Export
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setIsExportOpen(true);
      }
      // Ctrl+. : Toggle Focus Mode
      else if ((e.ctrlKey || e.metaKey) && e.key === ".") {
        e.preventDefault();
        setFocusMode((v) => !v);
        setSpeech(!focusMode ? "Focus mode enabled." : "Focus mode disabled.");
      }
      // Ctrl+/ : Shortcuts
      else if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
      // Esc: Reset typing fade & close dialogs
      else if (e.key === "Escape") {
        setIsTyping(false);
        setIsSearchOpen(false);
        setIsShortcutsOpen(false);
        setIsExportOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode, setSpeech]);

  return (
    <main
      onMouseMove={() => setIsTyping(false)}
      className={`flex-1 flex flex-col w-full bg-transparent transition-all duration-300 relative z-10 ${
        focusMode ? "focus-mode-active" : ""
      }`}
    >
      {/* 1. Cartoon Folder Tab Strip directly at the top of the paper */}
      <div className="w-full relative z-20">
        <TabStrip />
      </div>

      {/* 2. Full-bleed Paper Sheet Area (writing directly on the paper canvas, free of any lines or shapes) */}
      <div className="flex-1 flex flex-col w-full bg-transparent">
        {activeId && activeNote ? (
          <EditorView
            key={activeId}
            noteId={activeId}
            initialTitle={activeNote.title}
            initialContent={activeNote.content}
            speechLine={speech}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-12 text-center bg-transparent">
            <p className="opacity-60 text-sm">{t("app.noNotes")}</p>
          </div>
        )}
      </div>

      {/* 3. Subtle floating tools in bottom corner (fades during typing, 0 clutter on the paper) */}
      <div
        className={`fixed bottom-10 right-10 z-40 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--theme-patch)] border border-[var(--theme-border)] shadow-md select-none transition-opacity duration-300 ${
          isTyping ? "opacity-0 pointer-events-none" : "opacity-35 hover:opacity-100"
        }`}
      >
        <button
          type="button"
          title="Search Notes (Ctrl+K)"
          onClick={() => setIsSearchOpen(true)}
          className="text-xs px-1.5 py-0.5 rounded hover:bg-[var(--theme-cream)] font-bold cursor-pointer"
        >
          🔍
        </button>
        <button
          type="button"
          title="Export / Screenshot (Ctrl+Shift+S)"
          onClick={() => setIsExportOpen(true)}
          className="text-xs px-1.5 py-0.5 rounded hover:bg-[var(--theme-cream)] font-bold cursor-pointer"
        >
          📷
        </button>
        <button
          type="button"
          title={t("settings.title")}
          onClick={() => setIsSettingsOpen(true)}
          className="text-xs px-1.5 py-0.5 rounded hover:bg-[var(--theme-cream)] font-bold cursor-pointer"
        >
          ⚙️
        </button>
        <button
          type="button"
          title="Shortcuts (Ctrl+/)"
          onClick={() => setIsShortcutsOpen(true)}
          className="text-xs px-1.5 py-0.5 rounded hover:bg-[var(--theme-cream)] font-bold cursor-pointer"
        >
          ?
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        filmEnabled={filmEnabled}
        onFilmToggle={setFilmEnabled}
        paperWidth={paperWidth}
        onPaperWidthChange={setPaperWidth}
      />

      {/* Export / Screenshot Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        noteTitle={activeNote?.title || "Note"}
        noteContent={activeNote?.content || ""}
      />

      {/* Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Shortcuts Cheat Sheet Modal (Ctrl+/) */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </main>
  );
}

export default function Home() {
  const [theme, setTheme] = useState("cream");
  const [filmEnabled, setFilmEnabled] = useState(false);
  const [paperWidth, setPaperWidth] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("writepad_paper_width") || "1200";
    }
    return "1200";
  });
  const [speech, setSpeech] = useState<string>("Ready to write!");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("writepad_paper_width", paperWidth);
    const maxWidth = paperWidth === "full" ? "100%" : `${paperWidth}px`;
    document.documentElement.style.setProperty("--paper-max-width", maxWidth);
  }, [paperWidth]);

  return (
    <div className="burnt-paper-viewport">
      {/* SVG Filter for Organic Sea-Wave Undulating Burnt Edges */}
      <svg
        width="0"
        height="0"
        className="absolute w-0 h-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <filter id="sea-wave-burnt-edge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.007 0.005"
              numOctaves="2"
              seed="5"
              result="seaWaves"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035 0.035"
              numOctaves="3"
              seed="9"
              result="charNoise"
            />
            <feComposite
              in="seaWaves"
              in2="charNoise"
              operator="arithmetic"
              k1="0"
              k2="0.82"
              k3="0.18"
              k4="0"
              result="wavyBurntMap"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="wavyBurntMap"
              scale="26"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Burnt Paper Sheet floating inside 30px dark frame (max-width around 1200px) */}
      <div className="burnt-paper-sheet">
        {/* 1. Background layer with organic sea-wave burnt edge filter */}
        <div className="burnt-paper-bg-layer" aria-hidden="true" />

        {/* 2. Organic Burnt Edge Scorched Rim Overlay */}
        <div className="burnt-edge-overlay" aria-hidden="true" />

        {/* 3. Charred Fire / Scorch Flame Accents on Edges */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[20px]" aria-hidden="true">
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[rgba(26,11,3,0.7)] via-[rgba(65,24,6,0.25)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[rgba(26,11,3,0.8)] via-[rgba(65,24,6,0.3)] to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[rgba(26,11,3,0.65)] via-[rgba(65,24,6,0.2)] to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[rgba(26,11,3,0.65)] via-[rgba(65,24,6,0.2)] to-transparent" />
        </div>

        {/* 4. Crisp, unfiltered Content layer (Tabs, Editor, Title, Dialogs) */}
        <div className="burnt-paper-content">
          <I18nProvider>
            <TabsProvider>
              <PadContent
                theme={theme}
                setTheme={setTheme}
                filmEnabled={filmEnabled}
                setFilmEnabled={setFilmEnabled}
                paperWidth={paperWidth}
                setPaperWidth={setPaperWidth}
                speech={speech}
                setSpeech={setSpeech}
              />
            </TabsProvider>
          </I18nProvider>
        </div>
      </div>
    </div>
  );
}
