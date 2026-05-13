"use client";

import { useRef } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string;
  className?: string;
  language?: string;
  minimap?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  error,
  className,
  language = "json",
  minimap = false,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange: OnChange = (value) => {
    onChange?.(value || "");
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "border rounded-md overflow-hidden",
          error && "border-destructive"
        )}
      >
        <Editor
          height="300px"
          language={language}
          value={value}
          onChange={handleChange}
          onMount={handleMount}
          loading={
            <Skeleton className="h-[300px] w-full" />
          }
          options={{
            readOnly,
            minimap: { enabled: minimap },
            fontSize: 14,
            fontFamily: "var(--font-geist-mono)",
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            placeholder,
            domReadOnly: readOnly,
          }}
          theme="vs-dark"
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
