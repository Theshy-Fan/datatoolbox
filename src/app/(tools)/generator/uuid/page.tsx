"use client";

import { useState, useCallback } from "react";
import { Copy, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClipboard } from "@/hooks/useClipboard";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const { copy } = useClipboard();

  const handleGenerate = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuids((prev) => [...newUuids, ...prev]);
  }, [count]);

  const handleCopyAll = useCallback(() => {
    copy(uuids.join("\n"), `已复制 ${uuids.length} 个 UUID`);
  }, [uuids, copy]);

  const handleClear = useCallback(() => {
    setUuids([]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">UUID 生成</h1>
        <p className="text-muted-foreground mt-1">
          生成随机 UUID v4
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">生成设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">数量：</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-24"
            />
            <Button onClick={handleGenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              生成
            </Button>
          </div>
        </CardContent>
      </Card>

      {uuids.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">生成结果</CardTitle>
                <Badge variant="secondary">{uuids.length} 个</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                  <Copy className="mr-1 h-3 w-3" />
                  复制全部
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <Trash2 className="mr-1 h-3 w-3" />
                  清空
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-muted rounded-md"
                >
                  <code className="flex-1 font-mono text-sm">{uuid}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copy(uuid, "已复制 UUID")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
