"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { db, type NoteRecord } from "@/lib/db";

export interface TabItem {
  id: string;
  title: string;
  rating: number;
  pinned: boolean;
  isDirty?: boolean;
}

interface TabsContextType {
  tabs: TabItem[];
  activeId: string | null;
  activeNote: NoteRecord | null;
  setActiveId: (id: string) => void;
  createTab: (title?: string, content?: string) => Promise<string>;
  closeTab: (id: string) => void;
  reopenClosedTab: () => Promise<void>;
  pinTab: (id: string) => void;
  renameTab: (id: string, newTitle: string) => void;
  duplicateTab: (id: string) => Promise<void>;
  closeOthers: (id: string) => void;
  reorderTabs: (sourceIndex: number, targetIndex: number) => void;
  switchTabByIndex: (index: number) => void;
  nextTab: () => void;
  previousTab: () => void;
  updateActiveContent: (content: string) => void;
  updateActiveRating: (rating: number) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<NoteRecord | null>(null);
  const closedHistoryRef = useRef<{ id: string; title: string; content: string }[]>([]);
  const isLoadedRef = useRef(false);

  // Load session from Dexie on reload
  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const session = await db.tabSession.get("current");
        let initialTabs: TabItem[] = [];
        let initialActiveId: string | null = null;

        if (session && session.openIds.length > 0) {
          closedHistoryRef.current = session.closedHistory || [];
          const notes = await db.notes.bulkGet(session.openIds);
          initialTabs = notes
            .filter((n): n is NoteRecord => !!n && !n.deletedAt)
            .map((n) => ({
              id: n.id,
              title: n.title,
              rating: n.rating,
              pinned: n.pinned,
              isDirty: false,
            }));
          initialActiveId = session.activeId || (initialTabs[0]?.id ?? null);
        }

        // If no tabs exist, create initial default note (completely blank)
        if (initialTabs.length === 0) {
          const defaultId = crypto.randomUUID();
          const now = new Date().toISOString();
          const defaultNote: NoteRecord = {
            id: defaultId,
            title: "",
            content: "",
            rating: 0,
            pinned: false,
            version: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            editorMode: "rich",
            textDirection: "auto",
          };
          await db.notes.put(defaultNote);
          initialTabs = [
            {
              id: defaultId,
              title: "",
              rating: 0,
              pinned: false,
              isDirty: false,
            },
          ];
          initialActiveId = defaultId;
        } else if (
          initialTabs.length === 1 &&
          initialTabs[0].title === "Welcome Note"
        ) {
          // If previous session left the initial welcome note template, clear it to start blank
          const existingNote = await db.notes.get(initialTabs[0].id);
          if (existingNote && existingNote.content.includes("Welcome to Write Pad")) {
            existingNote.title = "";
            existingNote.content = "";
            await db.notes.put(existingNote);
            initialTabs[0].title = "";
          }
        }

        if (isMounted) {
          setTabs(initialTabs);
          setActiveIdState(initialActiveId);
          if (initialActiveId) {
            const note = await db.notes.get(initialActiveId);
            if (note) setActiveNote(note);
          }
          isLoadedRef.current = true;
        }
      } catch (err) {
        console.error("Failed to load tab session from Dexie:", err);
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save tab session to Dexie on change
  const saveSession = useCallback(
    async (currentTabs: TabItem[], currentActive: string | null) => {
      if (!isLoadedRef.current) return;
      try {
        await db.tabSession.put({
          id: "current",
          openIds: currentTabs.map((t) => t.id),
          activeId: currentActive || "",
          closedHistory: closedHistoryRef.current.slice(-15), // keep last 15
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Failed to save tab session:", e);
      }
    },
    []
  );

  const setActiveId = useCallback(
    async (id: string) => {
      setActiveIdState(id);
      const note = await db.notes.get(id);
      if (note) setActiveNote(note);
      saveSession(tabs, id);
    },
    [tabs, saveSession]
  );

  const createTab = useCallback(
    async (title: string = "", content: string = "") => {
      const newId = crypto.randomUUID();
      const now = new Date().toISOString();
      const newNote: NoteRecord = {
        id: newId,
        title,
        content,
        rating: 0,
        pinned: false,
        version: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        editorMode: "rich",
        textDirection: "auto",
      };
      await db.notes.put(newNote);
      const newTab: TabItem = {
        id: newId,
        title: newNote.title,
        rating: newNote.rating,
        pinned: false,
        isDirty: false,
      };

      setTabs((prev) => {
        const next = [...prev, newTab];
        saveSession(next, newId);
        return next;
      });

      setActiveIdState(newId);
      setActiveNote(newNote);
      return newId;
    },
    [saveSession]
  );

  const closeTab = useCallback(
    async (id: string) => {
      // Find tab
      const tabToClose = tabs.find((t) => t.id === id);
      if (tabToClose) {
        const note = await db.notes.get(id);
        if (note) {
          closedHistoryRef.current.push({
            id: note.id,
            title: note.title,
            content: note.content,
          });
        }
      }

      setTabs((prev) => {
        const index = prev.findIndex((t) => t.id === id);
        const nextTabs = prev.filter((t) => t.id !== id);

        let nextActive = activeId;
        if (activeId === id) {
          if (nextTabs.length > 0) {
            // Pick next adjacent tab
            const newIndex = Math.min(index, nextTabs.length - 1);
            nextActive = nextTabs[newIndex].id;
          } else {
            nextActive = null;
          }
        }

        if (nextActive) {
          db.notes.get(nextActive).then((n) => {
            if (n) setActiveNote(n);
          });
        } else {
          setActiveNote(null);
        }

        setActiveIdState(nextActive);
        saveSession(nextTabs, nextActive);
        return nextTabs;
      });
    },
    [tabs, activeId, saveSession]
  );

  const reopenClosedTab = useCallback(async () => {
    const lastClosed = closedHistoryRef.current.pop();
    if (!lastClosed) return;

    // Check if note still in db or recreate
    let note = await db.notes.get(lastClosed.id);
    if (!note) {
      const now = new Date().toISOString();
      note = {
        id: lastClosed.id,
        title: lastClosed.title,
        content: lastClosed.content,
        rating: 0,
        pinned: false,
        version: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };
      await db.notes.put(note);
    }

    const restoredTab: TabItem = {
      id: note.id,
      title: note.title,
      rating: note.rating,
      pinned: note.pinned,
      isDirty: false,
    };

    setTabs((prev) => {
      const next = [...prev, restoredTab];
      saveSession(next, restoredTab.id);
      return next;
    });

    setActiveIdState(restoredTab.id);
    setActiveNote(note);
  }, [saveSession]);

  const pinTab = useCallback(
    async (id: string) => {
      const note = await db.notes.get(id);
      if (!note) return;
      const newPinned = !note.pinned;
      await db.notes.update(id, { pinned: newPinned });

      setTabs((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, pinned: newPinned } : t));
        saveSession(next, activeId);
        return next;
      });
    },
    [activeId, saveSession]
  );

  const renameTab = useCallback(
    async (id: string, newTitle: string) => {
      await db.notes.update(id, { title: newTitle });
      setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t)));
      setActiveNote((prev) => (prev && prev.id === id ? { ...prev, title: newTitle } : prev));
    },
    []
  );

  const duplicateTab = useCallback(
    async (id: string) => {
      const original = await db.notes.get(id);
      if (!original) return;
      await createTab(`${original.title} (Copy)`, original.content);
    },
    [createTab]
  );

  const closeOthers = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.id === id || t.pinned);
        setActiveIdState(id);
        saveSession(next, id);
        return next;
      });
    },
    [saveSession]
  );

  const reorderTabs = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      setTabs((prev) => {
        const next = [...prev];
        const [moved] = next.splice(sourceIndex, 1);
        next.splice(targetIndex, 0, moved);
        saveSession(next, activeId);
        return next;
      });
    },
    [activeId, saveSession]
  );

  const switchTabByIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < tabs.length) {
        setActiveId(tabs[index].id);
      }
    },
    [tabs, setActiveId]
  );

  const nextTab = useCallback(() => {
    if (tabs.length <= 1) return;
    const currentIndex = tabs.findIndex((t) => t.id === activeId);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveId(tabs[nextIndex].id);
  }, [tabs, activeId, setActiveId]);

  const previousTab = useCallback(() => {
    if (tabs.length <= 1) return;
    const currentIndex = tabs.findIndex((t) => t.id === activeId);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveId(tabs[prevIndex].id);
  }, [tabs, activeId, setActiveId]);

  const updateActiveContent = useCallback(
    (newContent: string) => {
      if (!activeId) return;
      db.notes.update(activeId, { content: newContent, updatedAt: new Date().toISOString() });
      setActiveNote((prev) => (prev ? { ...prev, content: newContent } : null));
    },
    [activeId]
  );

  const updateActiveRating = useCallback(
    (newRating: number) => {
      if (!activeId) return;
      db.notes.update(activeId, { rating: newRating });
      setTabs((prev) => prev.map((t) => (t.id === activeId ? { ...t, rating: newRating } : t)));
      setActiveNote((prev) => (prev ? { ...prev, rating: newRating } : null));
    },
    [activeId]
  );

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeId,
        activeNote,
        setActiveId,
        createTab,
        closeTab,
        reopenClosedTab,
        pinTab,
        renameTab,
        duplicateTab,
        closeOthers,
        reorderTabs,
        switchTabByIndex,
        nextTab,
        previousTab,
        updateActiveContent,
        updateActiveRating,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
}
