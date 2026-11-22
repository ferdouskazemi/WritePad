"use client";

import React from "react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: "Ctrl + T / Alt + T", desc: "New Note / New Tab" },
  { key: "Ctrl + W / Alt + W", desc: "Close Current Tab" },
  { key: "Ctrl + Tab", desc: "Next Open Tab" },
  { key: "Ctrl + Shift + Tab", desc: "Previous Open Tab" },
  { key: "Ctrl + Shift + T", desc: "Reopen Last Closed Tab" },
  { key: "Ctrl + 1 ... 9", desc: "Jump to Tab 1 through 9" },
  { key: "Ctrl + K", desc: "Quick Search Across All Notes" },
  { key: "Ctrl + Shift + S", desc: "Screenshot & Export Dialog" },
  { key: "Ctrl + .", desc: "Toggle Focus Mode (dim inactive lines)" },
  { key: "Shift + Space", desc: "Insert Zero-Width Non-Joiner (نیم‌فاصله \u200C)" },
  { key: "Esc", desc: "Show Hidden Bars / Close Dialogs" },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--theme-paper)] text-[var(--theme-ink)] border-3 border-[var(--theme-border)] rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b-2 border-[var(--theme-border)] pb-2 mb-4">
          <h3 className="text-xl font-black font-serif">Keyboard Shortcuts</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-[var(--theme-border)] bg-[var(--theme-cream)] font-bold text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2 rounded border border-[var(--theme-border)] bg-[var(--theme-cream)] text-xs"
            >
              <span className="opacity-80">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded border border-[var(--theme-border)] bg-[var(--theme-paper)] font-mono font-bold text-[11px] shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
