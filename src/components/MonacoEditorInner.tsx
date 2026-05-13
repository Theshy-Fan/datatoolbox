"use client";

import { useRef } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";

interface MonacoEditorInnerProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  minimap?: boolean;
  placeholder?: string;
}

export function MonacoEditorInner({
  value,
  onChange,
  language = "json",
  readOnly = false,
  minimap = false,
  placeholder,
}: MonacoEditorInnerProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  return (
    <Editor
      height="300px"
      language={language}
      value={value}
      onChange={(v) => onChange?.(v || "")}
      onMount={(editor) => {
        editorRef.current = editor;
        editor.focus();
      }}
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
  );
}
