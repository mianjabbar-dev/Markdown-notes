import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { FileText } from "lucide-react";

interface PreviewProps {
  content: string;
}

export function Preview({ content }: PreviewProps) {
  const html = useMemo(() => {
    const raw = marked.parse(content || "", { async: false }) as string;
    return DOMPurify.sanitize(raw, {
      USE_PROFILES: { html: true },
    });
  }, [content]);

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex h-12 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <FileText className="mr-2 h-4 w-4 text-slate-400" />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Preview
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {content.trim() === "" ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 dark:text-slate-600">
            <FileText className="h-10 w-10" />
            <p className="mt-3 text-sm">Nothing to preview yet.</p>
          </div>
        ) : (
          <div
            className="md-preview max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
