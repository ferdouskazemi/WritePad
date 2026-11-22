"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "@/lib/markdown/roundtrip";
import { toPersianDigits } from "@/lib/markdown/textStats";
import "./editor.css";

interface RichEditorProps {
  content: string; // Markdown
  directionOverride?: "auto" | "ltr" | "rtl";
  persianDigits?: boolean;
  onChange: (markdown: string) => void;
  onEditorReady?: (editor: unknown) => void;
}

export function RichEditor({
  content,
  directionOverride = "auto",
  persianDigits = false,
  onChange,
  onEditorReady,
}: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content,
    editorProps: {
      attributes: {
        class: `prose max-w-none focus:outline-none min-h-[500px] py-4 font-serif text-[var(--theme-ink)] text-xl leading-relaxed ${
          directionOverride === "rtl"
            ? "dir-rtl"
            : directionOverride === "ltr"
            ? "dir-ltr"
            : "dir-auto"
        }`,
      },
      handleKeyDown: (view, event) => {
        // Shift+Space inserts Zero-Width Non-Joiner (ZWNJ U+200C)
        if (event.shiftKey && event.code === "Space") {
          event.preventDefault();
          view.dispatch(view.state.tr.insertText("\u200C"));
          return true;
        }

        // Convert typed Latin digits to Persian digits if in RTL paragraph and setting enabled
        if (persianDigits && /^[0-9]$/.test(event.key)) {
          const { $from } = view.state.selection;
          const node = $from.parent;
          const text = node.textContent;
          // Check if parent paragraph is RTL
          const isRtl =
            directionOverride === "rtl" ||
            /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);

          if (isRtl) {
            event.preventDefault();
            const persianChar = toPersianDigits(event.key);
            view.dispatch(view.state.tr.insertText(persianChar));
            return true;
          }
        }

        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      // Get markdown output from tiptap-markdown extension
      const storage = ed.storage as { markdown?: { getMarkdown: () => string } };
      const md = storage.markdown ? storage.markdown.getMarkdown() : ed.getText();
      onChange(md);
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Sync content when updated from outside (e.g. view switch or note change)
  useEffect(() => {
    if (editor) {
      const storage = editor.storage as { markdown?: { getMarkdown: () => string } };
      const currentMd = storage.markdown ? storage.markdown.getMarkdown() : editor.getText();
      if (content !== currentMd) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  return (
    <div className="rich-editor-wrapper w-full h-full bg-transparent overflow-y-auto">
      <EditorContent editor={editor} />
    </div>
  );
}
