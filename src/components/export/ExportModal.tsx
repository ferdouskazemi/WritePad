"use client";

import React, { useState, useRef } from "react";
import {
  captureElementToBlob,
  downloadBlob,
  downloadFile,
  copyBlobToClipboard,
  shareBlob,
} from "@/lib/screenshot/capture";
import { HoseProgress, HoseProgressRef, HoseButton, HoseToast, HoseToastRef } from "@/components/hose";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteTitle: string;
  noteContent: string;
}

export function ExportModal({
  isOpen,
  onClose,
  noteTitle,
  noteContent,
}: ExportModalProps) {
  const [scope, setScope] = useState<"whole" | "visible">("whole");
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressVal, setProgressVal] = useState(0);

  const progressRef = useRef<HoseProgressRef>(null);
  const toastRef = useRef<HoseToastRef>(null);

  if (!isOpen) return null;

  const getTargetElement = () => {
    // Finds the current writing canvas
    return (
      document.querySelector(".rich-editor-wrapper") ||
      document.querySelector(".prose") ||
      document.querySelector(".cm-content") ||
      document.body
    ) as HTMLElement;
  };

  const handleCopyPng = async () => {
    setIsProcessing(true);
    setProgressVal(0.2);
    try {
      const el = getTargetElement();
      const blob = await captureElementToBlob(el, {
        pixelRatio: 2,
        includeWatermark,
        onProgress: (p) => {
          setProgressVal(p);
          progressRef.current?.set(p);
        },
      });

      if (blob) {
        const ok = await copyBlobToClipboard(blob);
        if (ok) {
          toastRef.current?.show("Screenshot copied to clipboard!", "Copied!");
        } else {
          toastRef.current?.show("Clipboard access blocked. Please use Download.", "Notice");
        }
      }
    } catch (err) {
      console.error("Copy PNG error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPng = async () => {
    setIsProcessing(true);
    setProgressVal(0.2);
    try {
      const el = getTargetElement();
      const blob = await captureElementToBlob(el, {
        pixelRatio: 2,
        includeWatermark,
        onProgress: (p) => {
          setProgressVal(p);
          progressRef.current?.set(p);
        },
      });

      if (blob) {
        const filename = `${(noteTitle || "Note").replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_")}.png`;
        downloadBlob(blob, filename);
        toastRef.current?.show("Screenshot downloaded at 2x resolution!", "Saved!");
      }
    } catch (err) {
      console.error("Download PNG error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    setIsProcessing(true);
    try {
      const el = getTargetElement();
      const blob = await captureElementToBlob(el, { pixelRatio: 2, includeWatermark });
      if (blob) {
        const ok = await shareBlob(blob, noteTitle);
        if (ok) {
          toastRef.current?.show("Note shared successfully!", "Shared!");
        }
      }
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const filename = `${(noteTitle || "Note").replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_")}.md`;
    downloadFile(noteContent, filename, "text/markdown;charset=utf-8");
    toastRef.current?.show("Markdown file downloaded!", "Saved!");
  };

  const handleDownloadPlainText = () => {
    const filename = `${(noteTitle || "Note").replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_")}.txt`;
    downloadFile(noteContent, filename, "text/plain;charset=utf-8");
    toastRef.current?.show("Plain text file downloaded!", "Saved!");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
        <div className="bg-[var(--theme-paper)] text-[var(--theme-ink)] border-3 border-[var(--theme-border)] rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[var(--theme-border)] pb-3 mb-4">
            <h3 className="text-xl font-black font-serif">Export &amp; Screenshot</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[var(--theme-border)] bg-[var(--theme-cream)] font-bold text-sm flex items-center justify-center hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* Scope Options */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs font-bold block mb-1.5">Capture Scope</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScope("whole")}
                  className={`p-2.5 rounded-lg border-2 text-xs font-bold text-center transition-all ${
                    scope === "whole"
                      ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)]"
                      : "border-[var(--theme-border)] bg-[var(--theme-cream)] hover:bg-[var(--theme-paper)]"
                  }`}
                >
                  📄 Whole Note
                </button>
                <button
                  type="button"
                  onClick={() => setScope("visible")}
                  className={`p-2.5 rounded-lg border-2 text-xs font-bold text-center transition-all ${
                    scope === "visible"
                      ? "border-[var(--theme-ink)] bg-[var(--theme-ink)] text-[var(--theme-paper)]"
                      : "border-[var(--theme-border)] bg-[var(--theme-cream)] hover:bg-[var(--theme-paper)]"
                  }`}
                >
                  👁 Visible View
                </button>
              </div>
            </div>

            {/* Watermark toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="rounded accent-[var(--theme-ink)]"
              />
              <span>Include subtle &ldquo;Write Pad&rdquo; corner mark</span>
            </label>

            {/* Thermometer Progress Bar for long rendering */}
            {isProcessing && (
              <div className="p-3 bg-[var(--theme-cream)] rounded-lg border border-[var(--theme-border)] text-center">
                <span className="text-xs font-bold block mb-1">Rendering 2x High-DPI PNG...</span>
                <HoseProgress ref={progressRef} label="Export" value={progressVal} />
              </div>
            )}
          </div>

          {/* PNG Actions */}
          <div className="space-y-2 mb-4">
            <span className="text-xs font-bold block text-[var(--theme-ink-muted)]">PNG Image (2× HiDPI)</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isProcessing}
                className="p-2 rounded-lg border-2 border-[var(--theme-border)] bg-[var(--theme-cream)] hover:bg-[var(--theme-patch)] text-xs font-bold text-center disabled:opacity-50"
              >
                ⬇ Download
              </button>
              <button
                type="button"
                onClick={handleCopyPng}
                disabled={isProcessing}
                className="p-2 rounded-lg border-2 border-[var(--theme-border)] bg-[var(--theme-cream)] hover:bg-[var(--theme-patch)] text-xs font-bold text-center disabled:opacity-50"
              >
                📋 Copy
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={isProcessing}
                className="p-2 rounded-lg border-2 border-[var(--theme-border)] bg-[var(--theme-cream)] hover:bg-[var(--theme-patch)] text-xs font-bold text-center disabled:opacity-50"
              >
                🔗 Share
              </button>
            </div>
          </div>

          {/* Text File Downloads */}
          <div className="space-y-2 pt-3 border-t border-[var(--theme-ink-faint)]">
            <span className="text-xs font-bold block text-[var(--theme-ink-muted)]">Raw Note Files</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="p-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-paper)] hover:bg-[var(--theme-cream)] text-xs font-semibold text-center"
              >
                📥 Download .md
              </button>
              <button
                type="button"
                onClick={handleDownloadPlainText}
                className="p-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-paper)] hover:bg-[var(--theme-cream)] text-xs font-semibold text-center"
              >
                📄 Download .txt
              </button>
            </div>
          </div>

          {/* Close button */}
          <div className="mt-5 pt-3 border-t-2 border-[var(--theme-border)] flex justify-end">
            <div className="inline-block scale-90">
              <HoseButton onClick={onClose}>Close</HoseButton>
            </div>
          </div>
        </div>
      </div>

      <HoseToast ref={toastRef} />
    </>
  );
}
