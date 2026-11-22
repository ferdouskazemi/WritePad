"use client";

import React, { useRef } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import { RichEditor } from "./RichEditor";

interface SplitEditorProps {
  content: string;
  directionOverride?: "auto" | "ltr" | "rtl";
  persianDigits?: boolean;
  onChange: (markdown: string) => void;
}

export function SplitEditor({
  content,
  directionOverride = "auto",
  persianDigits = false,
  onChange,
}: SplitEditorProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleSourceScroll = (scrollTop: number, scrollHeight: number) => {
    if (previewRef.current) {
      const ratio = scrollTop / Math.max(1, scrollHeight - 300);
      const targetScroll = ratio * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
      previewRef.current.scrollTop = targetScroll;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-[var(--theme-border)] h-full w-full bg-[var(--theme-paper)]">
      {/* Markdown Source Pane */}
      <div className="h-full overflow-hidden flex flex-col">
        <div className="px-3 py-1 bg-[var(--theme-cream)] text-[var(--theme-ink)] text-xs font-bold border-b border-[var(--theme-ink-faint)] flex items-center justify-between">
          <span>Markdown Source</span>
          <span className="opacity-60 text-[10px]">CodeMirror 6</span>
        </div>
        <div className="flex-1 overflow-auto">
          <MarkdownEditor
            content={content}
            directionOverride={directionOverride}
            persianDigits={persianDigits}
            onChange={onChange}
            onScroll={handleSourceScroll}
          />
        </div>
      </div>

      {/* Rendered Preview Pane (Tiptap schema) */}
      <div className="h-full overflow-hidden flex flex-col">
        <div className="px-3 py-1 bg-[var(--theme-cream)] text-[var(--theme-ink)] text-xs font-bold border-b border-[var(--theme-ink-faint)] flex items-center justify-between">
          <span>Live Rendered Preview</span>
          <span className="opacity-60 text-[10px]">Tiptap Schema</span>
        </div>
        <div ref={previewRef} className="flex-1 overflow-y-auto">
          <RichEditor
            content={content}
            directionOverride={directionOverride}
            persianDigits={persianDigits}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
