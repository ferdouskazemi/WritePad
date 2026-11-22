import Dexie, { type Table } from "dexie";

export interface NoteRecord {
  id: string; // UUID made on client
  userId?: string;
  title: string;
  content: string; // Markdown text
  rating: number; // 0 to 5
  pinned: boolean;
  version: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  deletedAt?: string | null;
  editorMode?: "rich" | "markdown" | "split";
  textDirection?: "auto" | "ltr" | "rtl";
}

export interface TabSessionRecord {
  id: string; // "current"
  openIds: string[];
  activeId: string;
  closedHistory: { id: string; title: string; content: string }[];
  updatedAt: string;
}

export interface OutboxRecord {
  id: string;
  noteId: string;
  action: "create" | "update" | "delete";
  payload: NoteRecord;
  version: number;
  timestamp: number;
}

export class WritePadDatabase extends Dexie {
  notes!: Table<NoteRecord, string>;
  tabSession!: Table<TabSessionRecord, string>;
  outbox!: Table<OutboxRecord, string>;

  constructor() {
    super("WritePadDB");
    this.version(2).stores({
      notes: "id, updatedAt, rating, pinned, deletedAt",
      tabSession: "id",
      outbox: "id, noteId, timestamp",
    });
  }
}

export const db = new WritePadDatabase();
