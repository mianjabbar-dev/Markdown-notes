import { FileText, Plus, Search, Trash2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { extractTitle, formatDate, sortNotesByDate } from "@/lib/notes";
import type { Note } from "@/types";
import type { ChangeEvent } from "react";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewNote: () => void;
}

export function Sidebar({
  notes,
  activeNoteId,
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onSelect,
  onDelete,
  onNewNote,
}: SidebarProps) {
  const filtered = notes.filter((note) => {
    const term = searchQuery.toLowerCase();
    const title = note.title || extractTitle(note.content);
    return (
      title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    );
  });

  const sorted = sortNotesByDate(filtered);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-72 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-950 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
          <button
            type="button"
            onClick={onNewNote}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <Plus className="h-3.5 w-3.5" />
            New note
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none md:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-200 p-3 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search notes..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="h-[calc(100vh-7rem)] overflow-y-auto p-2 md:h-[calc(100vh-8rem)]">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                {searchQuery ? "No notes match your search." : "No notes yet."}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={onNewNote}
                  className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Create your first note
                </button>
              )}
            </div>
          ) : (
            <ul className="space-y-1">
              {sorted.map((note) => {
                const title = note.title || extractTitle(note.content);
                const isActive = note.id === activeNoteId;
                return (
                  <li key={note.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => onSelect(note.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 pr-10 text-left transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                      )}
                    >
                      <FileText
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-sm font-medium",
                            isActive
                              ? "text-indigo-900 dark:text-indigo-100"
                              : "text-slate-900 dark:text-slate-100"
                          )}
                        >
                          {title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(note.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-200 hover:text-red-600 focus:opacity-100 group-hover:opacity-100 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      aria-label="Delete note"
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
