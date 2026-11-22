"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";

interface FloatingSelectionMenuProps {
  editor: Editor | null;
}

interface MenuPosition {
  top: number;
  left: number;
  isAbove?: boolean;
}

export function FloatingSelectionMenu({ editor }: FloatingSelectionMenuProps) {
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!editor || editor.isDestroyed) {
      setPosition(null);
      return;
    }

    const { from, to } = editor.state.selection;
    // Only show when there is an active text selection
    if (from === to) {
      setPosition(null);
      return;
    }

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

    const menuEstimatedWidth = 460;
    const menuEstimatedHeight = 44;

    // Center horizontally on the selection, clamped to viewport bounds
    const screenWidth = window.innerWidth;
    const halfWidth = menuEstimatedWidth / 2;
    const rawLeft = rect.left + rect.width / 2;
    const clampedLeft = Math.max(halfWidth + 12, Math.min(screenWidth - halfWidth - 12, rawLeft));

    // Place underneath selection by default (+ 10px offset).
    // If overflowing viewport bottom, flip above selection.
    let top = rect.bottom + 10;
    let isAbove = false;
    if (top + menuEstimatedHeight > window.innerHeight - 10) {
      top = Math.max(10, rect.top - menuEstimatedHeight - 10);
      isAbove = true;
    }

    setPosition({
      top,
      left: clampedLeft,
      isAbove,
    });
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    // Listen to editor selection and transaction updates
    editor.on("selectionUpdate", updatePosition);
    editor.on("transaction", updatePosition);

    // Native selection and window events
    const handleNativeSelection = () => {
      // Small timeout to allow ProseMirror state to settle
      setTimeout(updatePosition, 10);
    };

    document.addEventListener("selectionchange", handleNativeSelection);
    document.addEventListener("mouseup", handleNativeSelection);
    document.addEventListener("keyup", handleNativeSelection);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("transaction", updatePosition);
      document.removeEventListener("selectionchange", handleNativeSelection);
      document.removeEventListener("mouseup", handleNativeSelection);
      document.removeEventListener("keyup", handleNativeSelection);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [editor, updatePosition]);

  if (!position || !editor) return null;

  const btnClass = (isActive: boolean = false) =>
    `inline-flex items-center justify-center h-7 px-2 text-xs font-bold rounded border transition-all cursor-pointer ${
      isActive
        ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)] shadow-inner"
        : "border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)] hover:bg-[var(--theme-cream)] active:scale-95"
    }`;

  const iconBtnClass = (isActive: boolean = false) =>
    `inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded border transition-all cursor-pointer ${
      isActive
        ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)] shadow-inner"
        : "border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)] hover:bg-[var(--theme-cream)] active:scale-95"
    }`;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      ref={menuRef}
      style={{
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
      }}
      className="fixed z-50 flex flex-wrap items-center gap-1 p-1 bg-[var(--theme-patch)] border-2 border-[var(--theme-border)] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.18)] select-none backdrop-blur-sm"
      onMouseDown={(e) => {
        // Prevent clicking toolbar buttons from unfocusing the text selection
        e.preventDefault();
      }}
    >
      {/* 1. Text Resize / Headings */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          title="Normal Text (Paragraph)"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={btnClass(editor.isActive("paragraph") && !editor.isActive("heading"))}
        >
          P
        </button>
        <button
          type="button"
          title="Large Heading (H1)"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btnClass(editor.isActive("heading", { level: 1 }))}
        >
          H1
        </button>
        <button
          type="button"
          title="Medium Heading (H2)"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive("heading", { level: 2 }))}
        >
          H2
        </button>
        <button
          type="button"
          title="Small Heading (H3)"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>
      </div>

      <span className="w-[1.5px] h-4 bg-[var(--theme-border)] opacity-40 mx-0.5" />

      {/* 2. Bold - Italic - Underline - Strike */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={iconBtnClass(editor.isActive("bold"))}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={iconBtnClass(editor.isActive("italic"))}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          title="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={iconBtnClass(editor.isActive("underline"))}
        >
          <span className="underline">U</span>
        </button>
        <button
          type="button"
          title="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={iconBtnClass(editor.isActive("strike"))}
        >
          <s>S</s>
        </button>
      </div>

      <span className="w-[1.5px] h-4 bg-[var(--theme-border)] opacity-40 mx-0.5" />

      {/* 3. Alignment (Left, Center, Right, Justify) */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          title="Align Left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={iconBtnClass(editor.isActive({ textAlign: "left" }))}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M3 5h18v2H3V5zm0 4h12v2H3V9zm0 4h18v2H3v-2zm0 4h12v2H3v-2z" />
          </svg>
        </button>
        <button
          type="button"
          title="Align Center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={iconBtnClass(editor.isActive({ textAlign: "center" }))}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M3 5h18v2H3V5zm3 4h12v2H6V9zm-3 4h18v2H3v-2zm3 4h12v2H6v-2z" />
          </svg>
        </button>
        <button
          type="button"
          title="Align Right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={iconBtnClass(editor.isActive({ textAlign: "right" }))}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M3 5h18v2H3V5zm6 4h12v2H9V9zm-6 4h18v2H3v-2zm6 4h12v2H9v-2z" />
          </svg>
        </button>
      </div>

      <span className="w-[1.5px] h-4 bg-[var(--theme-border)] opacity-40 mx-0.5" />

      {/* 4. Font Format & Blocks */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          title="Inline Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={iconBtnClass(editor.isActive("code"))}
        >
          <span className="font-mono text-[10px]">&lt;&gt;</span>
        </button>
        <button
          type="button"
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={iconBtnClass(editor.isActive("blockquote"))}
        >
          &ldquo;
        </button>
        <button
          type="button"
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={iconBtnClass(editor.isActive("bulletList"))}
        >
          •-
        </button>
        <button
          type="button"
          title="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={iconBtnClass(editor.isActive("orderedList"))}
        >
          1.
        </button>
        <button
          type="button"
          title="Add Link"
          onClick={setLink}
          className={iconBtnClass(editor.isActive("link"))}
        >
          🔗
        </button>
      </div>
    </div>
  );
}
