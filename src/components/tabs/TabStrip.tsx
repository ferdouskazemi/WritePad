"use client";

import React, { useState } from "react";
import { useTabs } from "./TabsContext";
import { useTabShortcuts } from "./useTabShortcuts";
import { HoseTabs } from "@/components/hose/HoseTabs";
import "./tabStyles.css";

export function TabStrip() {
  const {
    tabs,
    activeId,
    setActiveId,
    createTab,
    closeTab,
  } = useTabs();

  useTabShortcuts();

  const [showAllTabsDropdown, setShowAllTabsDropdown] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeId));
  const hoseTabItems = tabs.map((t, idx) => {
    let lbl = t.title ? t.title.trim() : `Note ${idx + 1}`;
    if (lbl.length > 14) lbl = lbl.slice(0, 13) + "…";
    return {
      label: lbl,
      value: t.id,
    };
  });

  const filteredTabs = tabs.filter((t) =>
    (t.title || "Untitled").toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="hose-tab-strip-container">
      {/* 1. Authentic Animated Cartoon Tabs from Rubber Hose UI */}
      <div className="hose-tab-wrapper">
        <HoseTabs
          key={`hose-tabs-${tabs.length}-${activeId}`}
          label="Notes"
          tabs={hoseTabItems}
          selectedIndex={activeIndex}
          onChange={({ value }) => {
            if (value && value !== activeId) {
              setActiveId(value);
            }
          }}
        />
      </div>

      {/* 2. Easy inline + button to add new tab */}
      <button
        type="button"
        title="New note (Ctrl+T)"
        onClick={() => createTab()}
        className="tab-add-inline-btn"
        aria-label="New tab"
      >
        +
      </button>

      {/* 3. Close active tab button (when more than 1 tab) */}
      {tabs.length > 1 && (
        <button
          type="button"
          title="Close current tab (Ctrl+W)"
          onClick={() => activeId && closeTab(activeId)}
          className="tab-close-inline-btn"
          aria-label="Close tab"
        >
          ×
        </button>
      )}

      {/* 4. Dropdown list if user has more than 4 tabs */}
      {tabs.length > 4 && (
        <div className="relative">
          <button
            type="button"
            title={`All open tabs (${tabs.length})`}
            onClick={() => setShowAllTabsDropdown((v) => !v)}
            className="w-7 h-7 rounded border border-[var(--theme-border)] bg-[var(--theme-paper)] text-[var(--theme-ink)] text-xs flex items-center justify-center hover:bg-[var(--theme-cream)] shadow-sm font-bold"
          >
            ▾
          </button>

          {showAllTabsDropdown && (
            <div className="absolute left-0 top-9 w-64 bg-[var(--theme-paper)] border-2 border-[var(--theme-border)] shadow-xl rounded-lg p-2 z-50 text-[var(--theme-ink)]">
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
                    <span className="truncate">{t.title || "Untitled"}</span>
                    {tabs.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(t.id);
                        }}
                        className="opacity-50 hover:opacity-100 ml-2 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
