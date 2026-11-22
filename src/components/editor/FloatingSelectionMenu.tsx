"use client";

import React, { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

interface FloatingSelectionMenuProps {
  editor: Editor | null;
}

interface MenuPosition {
  top: number;
  left: number;
}

export function FloatingSelectionMenu({ editor }: FloatingSelectionMenuProps) {
  const [position, setPosition] = useState<MenuPosition | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editor || editor.isDestroyed) {
        setPosition(null);
        return;
      }

      const { from, to } = editor.state.selection;
      // Only show when text is actively selected
      if (from === to) {
        setPosition(null);
        return;
      }

      // Get DOM selection bounds
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setPosition(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        setPosition(null);
        return;
      }

      // Position directly underneath the selection
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editor]);

  if (!position || !editor) return null;

  const btnClass = (isActive: boolean = false) =>
    `inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded border transition-all ${
      isActive
        ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)]"
        : "border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)] hover:bg-[var(--theme-cream)]"
    }`;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
      }}
      className="fixed z-50 flex items-center gap-1 p-1 bg-[var(--theme-patch)] border-2 border-[var(--theme-border)] rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none"
      onMouseDown={(e) => {
        // Prevent losing editor selection on button click
        e.preventDefault();
      }}
    >
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

      <span className="w-[1px] h-4 bg-[var(--theme-ink-faint)] mx-0.5" />

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
        title="Inline Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(editor.isActive("code"))}
      >
        &lt;&gt;
      </button>

      <span className="w-[1px] h-4 bg-[var(--theme-ink-faint)] mx-0.5" />

      <button
        type="button"
        title="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        •-
      </button>

      <button
        type="button"
        title="Blockquote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        &ldquo;
      </button>

      <button
        type="button"
        title="Link"
        onClick={setLink}
        className={btnClass(editor.isActive("link"))}
      >
        🔗
      </button>
    </div>
  );
}
