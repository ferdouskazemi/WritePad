"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";
import { EditorToolbar } from "./EditorToolbar";
import { RichEditor } from "./RichEditor";
import { MarkdownEditor } from "./MarkdownEditor";
import { SplitEditor } from "./SplitEditor";
import { calculateTextStats } from "@/lib/markdown/textStats";
import { db, type NoteRecord } from "@/lib/db";

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
  initialContent = "# Welcome to Write Pad\n\nWrite equally well in **English** and **دری / پښتو**.\n\n- Mixed lines render cleanly: Write Pad یادداشت\n- Pashto letters check: ټ ډ ړ ږ ښ ګ ڼ ۍ ې\n- Numbers and digits: 123 or ۱۲۳",
  speechLine,
}: EditorViewProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [editorMode, setEditorMode] = useState<"rich" | "markdown" | "split">("rich");
  const [directionOverride, setDirectionOverride] = useState<"auto" | "ltr" | "rtl">("auto");
  const [persianDigits, setPersianDigits] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [tiptapInstance, setTiptapInstance] = useState<Editor | null>(null);
  const isLoadedRef = useRef(false);

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

  // Autosave to Dexie on every keystroke
  const saveToDb = useCallback(
    async (newTitle: string, newContent: string) => {
      if (!isLoadedRef.current) return;
      setSaveStatus("saving");
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
        setSaveStatus("saved");
      } catch (e) {
        console.error("Dexie autosave error:", e);
      }
    },
    [noteId, editorMode, directionOverride]
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
    <div className="flex flex-col h-full w-full bg-[var(--theme-paper)] text-[var(--theme-ink)] rounded-lg overflow-hidden border-2 border-[var(--theme-border)] shadow-[0_4px_0_var(--theme-shadow)]">
      {/* Title bar */}
      <div className="px-4 py-3 bg-[var(--theme-cream)] border-b-2 border-[var(--theme-border)] flex items-center justify-between gap-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full placeholder:opacity-50 text-[var(--theme-ink)] font-serif"
        />
        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full border ${
              saveStatus === "saved"
                ? "border-green-800 text-green-900 bg-green-100"
                : "border-amber-800 text-amber-900 bg-amber-100"
            }`}
          >
            {saveStatus === "saved" ? "● Saved locally" : "○ Saving..."}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <EditorToolbar
        editor={tiptapInstance}
        editorMode={editorMode}
        onModeChange={(mode) => {
          setEditorMode(mode);
          saveToDb(title, content);
        }}
        directionOverride={directionOverride}
        onDirectionChange={(dir) => {
          setDirectionOverride(dir);
          saveToDb(title, content);
        }}
        persianDigits={persianDigits}
        onPersianDigitsToggle={setPersianDigits}
      />

      {/* Active Editor Pane */}
      <div className="flex-1 overflow-hidden relative">
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

      {/* Status Bar */}
      <footer className="px-4 py-1.5 bg-[var(--theme-cream)] border-t border-[var(--theme-border)] text-xs text-[var(--theme-ink-muted)] flex items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <span>{stats.words} words</span>
          <span>•</span>
          <span>{stats.characters} characters</span>
          <span>•</span>
          <span>{stats.paragraphs} paragraphs</span>
        </div>

        {speechLine && (
          <div className="text-right truncate italic opacity-80 max-w-sm">
            &ldquo;{speechLine}&rdquo;
          </div>
        )}
      </footer>
    </div>
  );
}
