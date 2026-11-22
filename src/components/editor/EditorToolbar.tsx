"use client";

import React from "react";
import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
  editorMode: "rich" | "markdown" | "split";
  onModeChange: (mode: "rich" | "markdown" | "split") => void;
  directionOverride: "auto" | "ltr" | "rtl";
  onDirectionChange: (dir: "auto" | "ltr" | "rtl") => void;
  persianDigits: boolean;
  onPersianDigitsToggle: (val: boolean) => void;
}

export function EditorToolbar({
  editor,
  editorMode,
  onModeChange,
  directionOverride,
  onDirectionChange,
  persianDigits,
  onPersianDigitsToggle,
}: EditorToolbarProps) {
  if (!editor && editorMode === "rich") return null;

  const btnClass = (isActive: boolean = false) =>
    `inline-flex items-center justify-center min-w-[32px] h-8 px-2 text-xs font-semibold rounded-md border-2 transition-all ${
      isActive
        ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)] shadow-inner translate-y-[1px]"
        : "border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)] hover:bg-[var(--theme-cream)] shadow-[0_2px_0_var(--theme-shadow)] active:translate-y-[1px] active:shadow-none"
    }`;

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b-2 border-[var(--theme-border)] bg-[var(--theme-cream)] text-[var(--theme-ink)] select-none">
      {/* Formatting buttons (active only in rich view) */}
      <div className="flex flex-wrap items-center gap-1">
        {editor && editorMode !== "markdown" && (
          <>
            <button
              type="button"
              title="Undo (Ctrl+Z)"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className={`${btnClass()} disabled:opacity-40`}
            >
              ↺
            </button>
            <button
              type="button"
              title="Redo (Ctrl+Y)"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className={`${btnClass()} disabled:opacity-40`}
            >
              ↻
            </button>

            <span className="w-[1px] h-5 bg-[var(--theme-ink-faint)] mx-1" />

            <button
              type="button"
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={btnClass(editor.isActive("heading", { level: 1 }))}
            >
              H1
            </button>
            <button
              type="button"
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={btnClass(editor.isActive("heading", { level: 2 }))}
            >
              H2
            </button>
            <button
              type="button"
              title="Heading 3"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={btnClass(editor.isActive("heading", { level: 3 }))}
            >
              H3
            </button>

            <span className="w-[1px] h-5 bg-[var(--theme-ink-faint)] mx-1" />

            <button
              type="button"
              title="Bold (Ctrl+B)"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={btnClass(editor.isActive("bold"))}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              title="Italic (Ctrl+I)"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={btnClass(editor.isActive("italic"))}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              title="Strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={btnClass(editor.isActive("strike"))}
            >
              <s>S</s>
            </button>
            <button
              type="button"
              title="Inline Code"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={btnClass(editor.isActive("code"))}
            >
              &lt;/&gt;
            </button>

            <span className="w-[1px] h-5 bg-[var(--theme-ink-faint)] mx-1" />

            <button
              type="button"
              title="Bullet List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={btnClass(editor.isActive("bulletList"))}
            >
              •-
            </button>
            <button
              type="button"
              title="Numbered List"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={btnClass(editor.isActive("orderedList"))}
            >
              1.
            </button>
            <button
              type="button"
              title="Task List"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={btnClass(editor.isActive("taskList"))}
            >
              ☑
            </button>

            <span className="w-[1px] h-5 bg-[var(--theme-ink-faint)] mx-1" />

            <button
              type="button"
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={btnClass(editor.isActive("blockquote"))}
            >
              &ldquo;&rdquo;
            </button>
            <button
              type="button"
              title="Code Block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={btnClass(editor.isActive("codeBlock"))}
            >
              {`{ }`}
            </button>
            <button
              type="button"
              title="Insert Link"
              onClick={setLink}
              className={btnClass(editor.isActive("link"))}
            >
              🔗
            </button>
            <button
              type="button"
              title="Insert Table"
              onClick={insertTable}
              className={btnClass(editor.isActive("table"))}
            >
              ⊞
            </button>
            <button
              type="button"
              title="Horizontal Rule"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className={btnClass()}
            >
              —
            </button>
          </>
        )}
      </div>

      {/* Mode Switcher & Direction Tools */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Direction Switcher */}
        <div className="flex items-center gap-1 bg-[var(--theme-paper)] p-0.5 rounded-lg border border-[var(--theme-border)]">
          {(["auto", "ltr", "rtl"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => onDirectionChange(dir)}
              className={`px-2 py-0.5 text-xs font-semibold rounded capitalize ${
                directionOverride === dir
                  ? "bg-[var(--theme-ink)] text-[var(--theme-paper)]"
                  : "text-[var(--theme-ink)] hover:opacity-80"
              }`}
            >
              {dir}
            </button>
          ))}
        </div>

        {/* Persian Digits Switch */}
        <button
          type="button"
          title="Convert Latin digits to Persian digits (۱۲۳) in RTL paragraphs"
          onClick={() => onPersianDigitsToggle(!persianDigits)}
          className={`px-2 py-1 text-xs font-semibold rounded border ${
            persianDigits
              ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)]"
              : "border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)]"
          }`}
        >
          {persianDigits ? "۱۲۳ On" : "123"}
        </button>

        {/* View Mode Radio (Rich / Markdown / Split) */}
        <div className="flex items-center gap-1 bg-[var(--theme-patch)] p-0.5 rounded-lg border-2 border-[var(--theme-border)]">
          {(["rich", "markdown", "split"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onModeChange(mode)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md capitalize transition-all ${
                editorMode === mode
                  ? "bg-[var(--theme-ink)] text-[var(--theme-paper)] shadow-sm"
                  : "text-[var(--theme-ink)] hover:bg-[var(--theme-cream)]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
