import type { Note } from "@/types";

export function createNote(title = "", content = ""): Note {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
}

export function extractTitle(content: string): string {
  const firstLine = content.trimStart().split("\n")[0] || "";
  const cleaned = firstLine.replace(/^#+\s*/, "").trim();
  return cleaned || "Untitled note";
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sortNotesByDate(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
}
