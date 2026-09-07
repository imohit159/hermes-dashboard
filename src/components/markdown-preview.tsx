"use client";

import { useState, useMemo } from "react";
import { marked } from "marked";

export function MarkdownPreview({ initial = "" }: { initial?: string }) {
  const [content, setContent] = useState(initial);
  const [mode, setMode] = useState<"split" | "edit" | "preview">("split");

  const html = useMemo(() => marked(content) as string, [content]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 pb-2 border-b border-border mb-2">
        <button
          onClick={() => setMode("split")}
          className={`px-3 py-1 text-xs rounded ${mode === "split" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          Split
        </button>
        <button
          onClick={() => setMode("edit")}
          className={`px-3 py-1 text-xs rounded ${mode === "edit" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          Edit
        </button>
        <button
          onClick={() => setMode("preview")}
          className={`px-3 py-1 text-xs rounded ${mode === "preview" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          Preview
        </button>
      </div>

      <div className="flex-1 grid gap-4 overflow-hidden" style={{
        gridTemplateColumns: mode === "split" ? "1fr 1fr" : "1fr"
      }}>
        {mode !== "preview" && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full resize-none bg-transparent text-sm font-mono focus:outline-none border border-border rounded-md p-4"
            placeholder="Write markdown here..."
          />
        )}
        {mode !== "edit" && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none overflow-auto border border-border rounded-md p-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
