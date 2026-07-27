import { FilePlus, Menu, Moon, Sun } from "lucide-react";
import { IconButton } from "./IconButton";
import type { Theme } from "@/types";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onNewNote: () => void;
  onToggleSidebar: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  onNewNote,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-2">
        <IconButton
          className="md:hidden"
          onClick={onToggleSidebar}
          label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </IconButton>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg
              className="h-5 w-5"
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
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Markdown Notes
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <IconButton onClick={onNewNote} label="New note" className="hidden sm:inline-flex">
          <FilePlus className="h-5 w-5" />
        </IconButton>
        <IconButton onClick={onNewNote} label="New note" className="sm:hidden">
          <FilePlus className="h-5 w-5" />
        </IconButton>
        <IconButton
          onClick={onToggleTheme}
          label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </IconButton>
      </div>
    </header>
  );
}
