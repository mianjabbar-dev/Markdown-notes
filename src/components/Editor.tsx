import type { ChangeEvent } from "react";

interface EditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onChange: (content: string) => void;
}

export function Editor({ title, onTitleChange, content, onChange }: EditorProps) {
  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTitleChange(e.target.value);
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="w-full border-none bg-transparent text-xl font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-50"
        />
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing in Markdown..."
        spellCheck={false}
        className="flex-1 resize-none bg-white p-6 font-mono text-sm leading-7 text-slate-800 placeholder:text-slate-400 focus:outline-none dark:bg-slate-950 dark:text-slate-200"
      />
    </div>
  );
}
