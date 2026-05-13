import { Braces, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Braces className="h-12 w-12 text-primary animate-pulse" />
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>加载中...</span>
      </div>
    </div>
  );
}
