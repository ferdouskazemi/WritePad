"use client";

import React, { useRef, useState, useEffect } from "react";
import { useTabs } from "./TabsContext";
import { useTabShortcuts } from "./useTabShortcuts";
import "./tabStyles.css";

interface ContextMenuState {
  x: number;
  y: number;
  tabId: string;
}

export function TabStrip() {
  const {
    tabs,
    activeId,
    setActiveId,
    createTab,
    closeTab,
    pinTab,
    renameTab,
    duplicateTab,
    closeOthers,
    reorderTabs,
  } = useTabs();

  useTabShortcuts();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [showAllTabsDropdown, setShowAllTabsDropdown] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!scrollRef.current || !activeId) return;
    const activeEl = scrollRef.current.querySelector(`[data-tab-id="${activeId}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }
  }, [activeId]);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => setContextMenu(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      reorderTabs(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  // Right-click context menu handler
  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      tabId,
    });
  };

  // Middle click closes tab
  const handleAuxClick = (e: React.MouseEvent, tabId: string) => {
    if (e.button === 1) {
      // Middle mouse button
      e.preventDefault();
      closeTab(tabId);
    }
  };

  const filteredTabs = tabs.filter((t) =>
    t.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="tab-strip-container">
      {/* Fade edge start */}
      <div className="fade-edge-start" />

      {/* Tabs scroll rail */}
      <div ref={scrollRef} className="tab-strip-scroll flex-1">
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeId;
          return (
            <div
              key={tab.id}
              data-tab-id={tab.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onClick={() => setActiveId(tab.id)}
              onAuxClick={(e) => handleAuxClick(e, tab.id)}
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
              className={`folder-tab ${isActive ? "tab-active" : "tab-inactive"} ${
                tab.pinned ? "tab-pinned" : ""
              }`}
            >
              {/* Pin indicator */}
              {tab.pinned && <span className="text-xs">📌</span>}

              {/* Unsaved indicator */}
              {tab.isDirty && <span className="tab-unsaved-dot" title="Unsaved changes" />}

              {/* Title */}
              <span className="truncate max-w-[140px] font-serif">
                {tab.title || "Untitled"}
              </span>

              {/* Star rating count */}
              {tab.rating > 0 && (
                <span className="text-[11px] text-amber-700 opacity-90 font-mono">
                  ★{tab.rating}
                </span>
              )}

              {/* Close button (only non-pinned) */}
              {!tab.pinned && (
                <button
                  type="button"
                  title="Close tab (Ctrl+W or middle click)"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="tab-close-btn"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}

        {/* Plus button right next to the tab for easy tab addition */}
        <button
          type="button"
          title="New tab (Ctrl+T)"
          onClick={() => createTab()}
          className="tab-add-inline-btn"
          aria-label="New tab"
        >
          +
        </button>
      </div>

      {/* Fade edge end */}
      <div className="fade-edge-end" />

      {/* Action buttons on the strip (All Tabs List) */}
      <div className="flex items-center gap-1 px-2 pb-1 relative z-20">
        {/* All Tabs List Button */}
        <button
          type="button"
          title={`All open tabs (${tabs.length})`}
          onClick={() => setShowAllTabsDropdown((v) => !v)}
          className="w-7 h-7 rounded border border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)] text-xs flex items-center justify-center hover:bg-[var(--theme-cream)] shadow-sm"
        >
          ▾
        </button>

        {/* Dropdown list for 30+ tabs */}
        {showAllTabsDropdown && (
          <div className="absolute right-2 top-8 w-64 bg-[var(--theme-paper)] border-2 border-[var(--theme-border)] shadow-lg rounded-lg p-2 z-50 text-[var(--theme-ink)]">
            <input
              type="text"
              placeholder="Search tabs..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full text-xs p-1.5 rounded border border-[var(--theme-border)] bg-[var(--theme-cream)] outline-none mb-2"
            />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredTabs.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveId(t.id);
                    setShowAllTabsDropdown(false);
                  }}
                  className={`flex items-center justify-between p-1.5 text-xs rounded cursor-pointer ${
                    t.id === activeId
                      ? "bg-[var(--theme-ink)] text-[var(--theme-paper)] font-bold"
                      : "hover:bg-[var(--theme-cream)]"
                  }`}
                >
                  <span className="truncate">{t.title}</span>
                  {t.pinned && <span>📌</span>}
                </div>
              ))}
              {filteredTabs.length === 0 && (
                <div className="text-xs opacity-60 p-2 text-center">No tabs found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right-click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-[var(--theme-paper)] border-2 border-[var(--theme-border)] rounded-lg shadow-xl p-1.5 z-50 min-w-[150px] text-xs text-[var(--theme-ink)] flex flex-col gap-1"
        >
          <button
            type="button"
            onClick={() => {
              pinTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="text-left px-2 py-1 rounded hover:bg-[var(--theme-cream)]"
          >
            📌 Pin / Unpin Tab
          </button>
          <button
            type="button"
            onClick={() => {
              const current = tabs.find((t) => t.id === contextMenu.tabId);
              const newTitle = window.prompt("Rename note:", current?.title || "");
              if (newTitle) renameTab(contextMenu.tabId, newTitle);
              setContextMenu(null);
            }}
            className="text-left px-2 py-1 rounded hover:bg-[var(--theme-cream)]"
          >
            ✏ Rename
          </button>
          <button
            type="button"
            onClick={() => {
              duplicateTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="text-left px-2 py-1 rounded hover:bg-[var(--theme-cream)]"
          >
            📄 Duplicate Note
          </button>
          <hr className="border-[var(--theme-ink-faint)] my-0.5" />
          <button
            type="button"
            onClick={() => {
              closeOthers(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="text-left px-2 py-1 rounded hover:bg-[var(--theme-cream)]"
          >
            Close Other Tabs
          </button>
          <button
            type="button"
            onClick={() => {
              closeTab(contextMenu.tabId);
              setContextMenu(null);
            }}
            className="text-left px-2 py-1 rounded hover:bg-[var(--theme-cream)] text-red-800"
          >
            Close Tab
          </button>
        </div>
      )}
    </div>
  );
}
