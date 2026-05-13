"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const MonacoEditorInner = dynamic(
  () => import("./MonacoEditorInner").then((mod) => mod.MonacoEditorInner),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full" />,
  }
);

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
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "border rounded-md overflow-hidden",
          error && "border-destructive"
        )}
      >
        <MonacoEditorInner
          value={value}
          onChange={onChange}
          language={language}
          readOnly={readOnly}
          minimap={minimap}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
