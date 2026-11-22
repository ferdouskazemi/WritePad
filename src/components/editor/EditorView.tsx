"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { RichEditor } from "./RichEditor";
import { MarkdownEditor } from "./MarkdownEditor";
import { SplitEditor } from "./SplitEditor";
import { FloatingSelectionMenu } from "./FloatingSelectionMenu";
import { calculateTextStats } from "@/lib/markdown/textStats";
import { db, type NoteRecord } from "@/lib/db";
import { syncEngine } from "@/lib/sync/syncEngine";

interface EditorViewProps {
  noteId?: string;
  initialTitle?: string;
  initialContent?: string;
  onSpeechLine?: (line: string) => void;
  speechLine?: string;
}

export function EditorView({
  noteId = "default-note",
  initialTitle = "Untitled Note",
  initialContent = "# Welcome to Write Pad\n\nWrite equally well in **English** and **دری / پښتو**.\n\nSelect any text to format it with the floating cartoon menu!\n\n- Pashto letters check: ټ ډ ړ ږ ښ ګ ڼ ۍ ې\n- Numbers: 123 or ۱۲۳",
  speechLine,
}: EditorViewProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [editorMode, setEditorMode] = useState<"rich" | "markdown" | "split">("rich");
  const [directionOverride, setDirectionOverride] = useState<"auto" | "ltr" | "rtl">("auto");
  const [persianDigits, setPersianDigits] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [tiptapInstance, setTiptapInstance] = useState<Editor | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const isLoadedRef = useRef(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load from Dexie on mount
  useEffect(() => {
    let isMounted = true;
    db.notes
      .get(noteId)
      .then((record) => {
        if (isMounted && record) {
          setTitle(record.title);
          setContent(record.content);
          if (record.editorMode) setEditorMode(record.editorMode);
          if (record.textDirection) setDirectionOverride(record.textDirection);
        }
        isLoadedRef.current = true;
      })
      .catch((err) => {
        console.error("Failed to load note from Dexie:", err);
        isLoadedRef.current = true;
      });

    return () => {
      isMounted = false;
    };
  }, [noteId]);

  // Fade chrome during typing
  const handleTypingActivity = useCallback(() => {
    setIsTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  }, []);

  // Autosave to Dexie on every keystroke
  const saveToDb = useCallback(
    async (newTitle: string, newContent: string) => {
      if (!isLoadedRef.current) return;
      setSaveStatus("saving");
      handleTypingActivity();

      try {
        const now = new Date().toISOString();
        const existing = await db.notes.get(noteId);
        const record: NoteRecord = {
          id: noteId,
          title: newTitle,
          content: newContent,
          rating: existing?.rating || 0,
          pinned: existing?.pinned || false,
          version: (existing?.version || 1) + 1,
          createdAt: existing?.createdAt || now,
          updatedAt: now,
          deletedAt: null,
          editorMode,
          textDirection: directionOverride,
        };
        await db.notes.put(record);
        await syncEngine.queueChange(record, "update");
        setSaveStatus("saved");
      } catch (e) {
        console.error("Dexie autosave error:", e);
      }
    },
    [noteId, editorMode, directionOverride, handleTypingActivity]
  );

  const handleContentChange = (newMd: string) => {
    setContent(newMd);
    saveToDb(title, newMd);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    saveToDb(newTitle, content);
  };

  const stats = calculateTextStats(content);

  return (
    <div
      onMouseMove={() => setIsTyping(false)}
      className="flex flex-col flex-1 w-full bg-[var(--theme-paper)] text-[var(--theme-ink)] relative transition-opacity duration-300"
    >
      {/* Floating Mini Selection Formatting Menu (opens under selected text) */}
      <FloatingSelectionMenu editor={tiptapInstance} />

      {/* Floating View & Tools bar (fades away while typing for pure paper feel) */}
      <div
        className={`absolute top-3 right-4 z-20 flex items-center gap-2 transition-opacity duration-300 ${
          isTyping ? "opacity-0 pointer-events-none" : "opacity-90 hover:opacity-100"
        }`}
      >
        {/* Direction Switcher */}
        <div className="flex items-center gap-1 bg-[var(--theme-patch)] p-1 rounded-md border border-[var(--theme-border)] shadow-sm text-xs">
          {(["auto", "ltr", "rtl"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => {
                setDirectionOverride(dir);
                saveToDb(title, content);
              }}
              className={`px-1.5 py-0.5 rounded font-semibold capitalize ${
                directionOverride === dir
                  ? "bg-[var(--theme-ink)] text-[var(--theme-paper)]"
                  : "hover:bg-[var(--theme-cream)]"
              }`}
            >
              {dir}
            </button>
          ))}
        </div>

        {/* Persian Digits Switch */}
        <button
          type="button"
          onClick={() => setPersianDigits((v) => !v)}
          className={`px-2 py-1 text-xs font-bold rounded border ${
            persianDigits
              ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)]"
              : "border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)]"
          }`}
          title="Convert Latin digits to Persian digits (۱۲۳) in RTL paragraphs"
        >
          {persianDigits ? "۱۲۳" : "123"}
        </button>

        {/* View Switcher: Rich / Markdown / Split */}
        <div className="flex items-center gap-0.5 bg-[var(--theme-patch)] p-1 rounded-md border border-[var(--theme-border)] shadow-sm text-xs">
          {(["rich", "markdown", "split"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setEditorMode(mode);
                saveToDb(title, content);
              }}
              className={`px-2 py-0.5 rounded font-bold capitalize transition-all ${
                editorMode === mode
                  ? "bg-[var(--theme-ink)] text-[var(--theme-paper)]"
                  : "hover:bg-[var(--theme-cream)]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Pure Paper Sheet: Title written directly onto paper */}
      <div className="pt-6 px-6 sm:px-12">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title..."
          className="text-3xl sm:text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 w-full placeholder:opacity-30 text-[var(--theme-ink)] font-serif"
        />
        <div className="h-[2px] bg-[var(--theme-border)] opacity-20 mt-2 mb-4" />
      </div>

      {/* Writing Area: Fill paper */}
      <div className="flex-1 px-4 sm:px-10 overflow-y-auto">
        {editorMode === "rich" && (
          <RichEditor
            content={content}
            directionOverride={directionOverride}
            persianDigits={persianDigits}
            onChange={handleContentChange}
            onEditorReady={(ed) => setTiptapInstance(ed as Editor)}
          />
        )}
        {editorMode === "markdown" && (
          <MarkdownEditor
            content={content}
            directionOverride={directionOverride}
            persianDigits={persianDigits}
            onChange={handleContentChange}
          />
        )}
        {editorMode === "split" && (
          <SplitEditor
            content={content}
            directionOverride={directionOverride}
            persianDigits={persianDigits}
            onChange={handleContentChange}
          />
        )}
      </div>

      {/* Subtle bottom status indicator: Fades while typing */}
      <footer
        className={`px-6 sm:px-12 py-2 text-[11px] text-[var(--theme-ink-muted)] flex items-center justify-between border-t border-[var(--theme-ink-faint)] select-none transition-opacity duration-300 ${
          isTyping ? "opacity-0" : "opacity-75 hover:opacity-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.characters} chars</span>
          <span>•</span>
          <span>{saveStatus === "saved" ? "● Saved" : "○ Saving..."}</span>
        </div>

        {speechLine && (
          <div className="truncate italic max-w-sm">
            &ldquo;{speechLine}&rdquo;
          </div>
        )}
      </footer>
    </div>
  );
}
