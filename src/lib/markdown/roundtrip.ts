import { Markdown } from "tiptap-markdown";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: { HTMLAttributes: { class: "ink-code-block" } },
    blockquote: { HTMLAttributes: { class: "ink-quote" } },
    horizontalRule: { HTMLAttributes: { class: "ink-hr" } },
  }),
  TaskList.configure({ HTMLAttributes: { class: "ink-task-list" } }),
  TaskItem.configure({ nested: true, HTMLAttributes: { class: "ink-task-item" } }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: { class: "ink-link underline cursor-pointer" },
  }),
  Table.configure({ resizable: false, HTMLAttributes: { class: "ink-table" } }),
  TableRow,
  TableHeader,
  TableCell,
  Markdown.configure({
    html: false,
    tightLists: true,
    bulletListMarker: "-",
    linkify: true,
    breaks: false,
  }),
];
