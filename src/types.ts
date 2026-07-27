export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  notes: Note[];
  activeNoteId: string | null;
}

export type Theme = "light" | "dark";
