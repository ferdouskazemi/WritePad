"use client";

import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { toPersianDigits } from "@/lib/markdown/textStats";

interface MarkdownEditorProps {
  content: string;
  directionOverride?: "auto" | "ltr" | "rtl";
  persianDigits?: boolean;
  onChange: (markdown: string) => void;
  onScroll?: (scrollTop: number, scrollHeight: number) => void;
}

export function MarkdownEditor({
  content,
  directionOverride = "auto",
  persianDigits = false,
  onChange,
  onScroll,
}: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Ink tone theme for CodeMirror
    const inkTheme = EditorView.theme({
      "&": {
        height: "100%",
        fontFamily: "var(--font-mono)",
        fontSize: "15px",
        backgroundColor: "transparent",
        color: "var(--theme-ink)",
      },
      ".cm-content": {
        padding: "16px",
        caretColor: "var(--theme-ink)",
      },
      ".cm-line": {
        lineHeight: "1.7",
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: "var(--theme-ink)",
        borderLeftWidth: "2px",
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "var(--theme-ink-faint)",
      },
      ".cm-gutters": {
        backgroundColor: "var(--theme-cream)",
        color: "var(--theme-ink-muted)",
        borderRight: "1px solid var(--theme-ink-faint)",
      },
      ".cm-activeLine": {
        backgroundColor: "rgba(0, 0, 0, 0.03)",
      },
      ".cm-activeLineGutter": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      },
    });

    // Custom keymap for ZWNJ (Shift+Space) and digits
    const customKeymap = keymap.of([
      {
        key: "Shift-Space",
        run: (targetView) => {
          targetView.dispatch(targetView.state.replaceSelection("\u200C"));
          return true;
        },
      },
      ...defaultKeymap,
      ...historyKeymap,
    ]);

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        markdown(),
        inkTheme,
        customKeymap,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            onChange(newContent);
          }
        }),
        EditorView.domEventHandlers({
          scroll: (event, targetView) => {
            const scroller = targetView.scrollDOM;
            onScroll?.(scroller.scrollTop, scroller.scrollHeight);
          },
          keydown: (event, targetView) => {
            if (persianDigits && /^[0-9]$/.test(event.key)) {
              // Check if current line is RTL
              const { from } = targetView.state.selection.main;
              const line = targetView.state.doc.lineAt(from);
              const isRtl =
                directionOverride === "rtl" ||
                /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(line.text);

              if (isRtl) {
                event.preventDefault();
                targetView.dispatch(targetView.state.replaceSelection(toPersianDigits(event.key)));
                return true;
              }
            }
            return false;
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external content update if doc differs
  useEffect(() => {
    const view = viewRef.current;
    if (view && content !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: content },
      });
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden ${
        directionOverride === "rtl" ? "text-right" : ""
      }`}
    />
  );
}
