import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { createNote, extractTitle } from "@/lib/notes";
import { cn } from "@/utils/cn";
import type { AppState, Theme } from "@/types";

const DEFAULT_STATE: AppState = {
  notes: [
    {
      id: crypto.randomUUID(),
      title: "Welcome to Markdown Notes",
      content: `# Welcome to Markdown Notes

This is a lightweight, real-time Markdown note-taking app.

## Features

- **Live preview** as you type
- **Auto-save** to browser local storage
- **Dark mode** toggle for comfortable writing
- Clean, minimal interface

Try editing this note or create a new one!`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ],
  activeNoteId: null,
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("md-notes-theme") as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const [state, setState] = useLocalStorage<AppState>(
    "md-notes-state",
    DEFAULT_STATE
  );
  const [theme, setTheme] = useLocalStorage<Theme>(
    "md-notes-theme",
    getInitialTheme()
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Ensure the active note is valid whenever the note list changes.
  useEffect(() => {
    setState((prev) => {
      const exists = prev.notes.some((n) => n.id === prev.activeNoteId);
      if (exists || prev.notes.length === 0) return prev;
      return { ...prev, activeNoteId: prev.notes[0].id };
    });
  }, [state.notes, setState]);

  // Keep the DOM class in sync with the persisted theme.
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const activeNote = useMemo(
    () => state.notes.find((n) => n.id === state.activeNoteId) || null,
    [state.notes, state.activeNoteId]
  );

  const handleNewNote = useCallback(() => {
    const note = createNote();
    setState((prev) => ({
      notes: [note, ...prev.notes],
      activeNoteId: note.id,
    }));
    setSidebarOpen(false);
  }, [setState]);

  const handleSelectNote = useCallback(
    (id: string) => {
      setState((prev) => ({ ...prev, activeNoteId: id }));
      setSidebarOpen(false);
    },
    [setState]
  );

  const handleDeleteNote = useCallback(
    (id: string) => {
      const note = state.notes.find((n) => n.id === id);
      const title = note?.title || extractTitle(note?.content || "");
      if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
      setState((prev) => {
        const remaining = prev.notes.filter((n) => n.id !== id);
        const nextActive =
          prev.activeNoteId === id
            ? remaining.length > 0
              ? remaining[0].id
              : null
            : prev.activeNoteId;
        return { notes: remaining, activeNoteId: nextActive };
      });
    },
    [setState, state.notes]
  );

  const handleUpdateContent = useCallback(
    (content: string) => {
      if (!activeNote) return;
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === activeNote.id
            ? { ...n, content, updatedAt: Date.now() }
            : n
        ),
      }));
    },
    [activeNote, setState]
  );

  const handleUpdateTitle = useCallback(
    (title: string) => {
      if (!activeNote) return;
      setState((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === activeNote.id ? { ...n, title, updatedAt: Date.now() } : n
        ),
      }));
    },
    [activeNote, setState]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return (
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 transition-colors",
        "dark:bg-slate-950 dark:text-slate-100"
      )}
    >
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onNewNote={handleNewNote}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          notes={state.notes}
          activeNoteId={state.activeNoteId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
          onNewNote={handleNewNote}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          {activeNote ? (
            <div className="grid flex-1 grid-cols-1 divide-y divide-slate-200 dark:divide-slate-800 md:grid-cols-2 md:divide-x md:divide-y-0">
              <Editor
                title={activeNote.title}
                onTitleChange={handleUpdateTitle}
                content={activeNote.content}
                onChange={handleUpdateContent}
              />
              <Preview content={activeNote.content} />
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-50">
                Select or create a note
              </h2>
              <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
                Your notes are automatically saved to your browser and restored
                when you come back.
              </p>
              <button
                type="button"
                onClick={handleNewNote}
                className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                Create new note
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
