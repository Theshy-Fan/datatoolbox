import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useClipboard(resetDelay: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string, message?: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(message || "已复制到剪贴板");

        setTimeout(() => {
          setCopied(false);
        }, resetDelay);

        return true;
      } catch {
        toast.error("复制失败，请手动复制");
        return false;
      }
    },
    [resetDelay]
  );

  return { copied, copy };
}
