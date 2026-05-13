"use client";

import { useState, useCallback } from "react";
import { Braces, Copy, Minimize2, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import { useClipboard } from "@/hooks/useClipboard";
import { formatJson, minifyJson, validateJson, getJsonStats } from "@/lib/json-utils";
import { toast } from "sonner";

const sampleJson = `{
  "name": "DataToolbox",
  "version": "1.0.0",
  "features": [
    "JSON 格式化",
    "树形展示",
    "格式转换"
  ],
  "config": {
    "theme": "auto",
    "language": "zh-CN"
  }
}`;

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string>();
  const { copied, copy } = useClipboard();

  const stats = input ? getJsonStats(input) : null;

  const handleFormat = useCallback(() => {
    const result = formatJson(input);
    if (result.success) {
      setOutput(result.data || "");
      setError(undefined);
      toast.success("格式化成功");
    } else {
      setError(result.error?.message);
      setOutput("");
      toast.error("JSON 格式错误");
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    const result = minifyJson(input);
    if (result.success) {
      setOutput(result.data || "");
      setError(undefined);
      toast.success("压缩成功");
    } else {
      setError(result.error?.message);
      setOutput("");
      toast.error("JSON 格式错误");
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    const result = validateJson(input);
    if (result.valid) {
      toast.success("JSON 格式正确");
      setError(undefined);
    } else {
      setError(result.error?.message);
      toast.error("JSON 格式错误");
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    if (output) {
      copy(output, "已复制格式化结果");
    }
  }, [output, copy]);

  const handleLoadSample = useCallback(() => {
    setInput(sampleJson);
    setError(undefined);
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(undefined);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">JSON 格式化</h1>
        <p className="text-muted-foreground mt-1">
          格式化、压缩、校验 JSON 数据
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleFormat}>
          <Braces className="mr-2 h-4 w-4" />
          格式化
        </Button>
        <Button variant="secondary" onClick={handleMinify}>
          <Minimize2 className="mr-2 h-4 w-4" />
          压缩
        </Button>
        <Button variant="secondary" onClick={handleValidate}>
          <Check className="mr-2 h-4 w-4" />
          校验
        </Button>
        <Button variant="outline" onClick={handleLoadSample}>
          <FileText className="mr-2 h-4 w-4" />
          示例
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          清空
        </Button>
      </div>

      {/* 编辑器区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">输入</CardTitle>
              {stats && (
                <span className="text-xs text-muted-foreground">
                  {stats.size} 字节 · {stats.keys} 个键 · 深度 {stats.depth}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={input}
              onChange={setInput}
              placeholder="粘贴或输入 JSON 数据..."
              error={error}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">输出</CardTitle>
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="mr-1 h-3 w-3" />
                  {copied ? "已复制" : "复制"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={output}
              readOnly
              placeholder="格式化结果将在此显示..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
