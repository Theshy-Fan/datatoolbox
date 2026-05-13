"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClipboard } from "@/hooks/useClipboard";

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function parseDate(dateStr: string): number | null {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date.getTime();
}

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const { copy } = useClipboard();

  // 更新当前时间戳
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTimestampToDate = useCallback(() => {
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) {
      return;
    }
    // 支持秒级时间戳
    const ms = ts.toString().length === 10 ? ts * 1000 : ts;
    setDateStr(formatTimestamp(ms));
  }, [timestamp]);

  const handleDateToTimestamp = useCallback(() => {
    const ts = parseDate(dateStr);
    if (ts !== null) {
      setTimestamp(ts.toString());
    }
  }, [dateStr]);

  const handleCopyTimestamp = useCallback(() => {
    copy(currentTimestamp.toString(), "已复制当前时间戳");
  }, [currentTimestamp, copy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">时间戳转换</h1>
        <p className="text-muted-foreground mt-1">
          Unix 时间戳与日期字符串互转
        </p>
      </div>

      {/* 当前时间戳 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">当前时间戳</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-3xl font-mono font-bold">{currentTimestamp}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatTimestamp(currentTimestamp)}
              </p>
            </div>
            <Button variant="outline" onClick={handleCopyTimestamp}>
              <Copy className="mr-2 h-4 w-4" />
              复制
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 时间戳转日期 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">时间戳 → 日期</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="输入时间戳（秒或毫秒）"
              className="font-mono"
            />
            <Button onClick={handleTimestampToDate}>转换</Button>
          </div>
          {dateStr && (
            <div className="p-3 bg-muted rounded-md font-mono">{dateStr}</div>
          )}
        </CardContent>
      </Card>

      {/* 日期转时间戳 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">日期 → 时间戳</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="font-mono"
            />
            <Button onClick={handleDateToTimestamp}>转换</Button>
          </div>
          {timestamp && (
            <div className="p-3 bg-muted rounded-md font-mono">{timestamp}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
