"use client";

import { useEffect } from "react";
import { useTabs } from "./TabsContext";

export function useTabShortcuts() {
  const {
    activeId,
    createTab,
    closeTab,
    reopenClosedTab,
    switchTabByIndex,
    nextTab,
    previousTab,
  } = useTabs();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+T or Alt+T: New tab (browsers often intercept Ctrl+T)
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === "t") {
        if (e.shiftKey) {
          // Ctrl+Shift+T: Reopen closed tab
          e.preventDefault();
          reopenClosedTab();
        } else if (e.altKey) {
          // Alt+T fallback for new tab
          e.preventDefault();
          createTab();
        }
      }

      // Ctrl+W or Alt+W: Close tab
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === "w" && activeId) {
        if (e.altKey) {
          e.preventDefault();
          closeTab(activeId);
        }
      }

      // Ctrl+Tab / Ctrl+Shift+Tab (or Alt+Tab alternative with [ / ])
      if ((e.ctrlKey || e.metaKey) && e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          previousTab();
        } else {
          nextTab();
        }
      }

      // Ctrl+1 through Ctrl+9: Jump to tab 1-9
      if ((e.ctrlKey || e.metaKey || e.altKey) && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key, 10) - 1;
        e.preventDefault();
        switchTabByIndex(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeId,
    createTab,
    closeTab,
    reopenClosedTab,
    switchTabByIndex,
    nextTab,
    previousTab,
  ]);
}
