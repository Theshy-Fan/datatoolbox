"use client";

import { useState, useCallback } from "react";
import { ArrowRight, Copy, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClipboard } from "@/hooks/useClipboard";
import { convertFormat, type ConvertFormat } from "@/lib/json-utils";
import { toast } from "sonner";

const formats: { value: ConvertFormat; label: string }[] = [
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "csv", label: "CSV" },
];

const sampleJson = `[
  { "name": "张三", "age": 28, "city": "北京" },
  { "name": "李四", "age": 32, "city": "上海" },
  { "name": "王五", "age": 25, "city": "广州" }
]`;

export default function JsonConverterPage() {
  const [fromFormat, setFromFormat] = useState<ConvertFormat>("json");
  const [toFormat, setToFormat] = useState<ConvertFormat>("yaml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string>();
  const { copied, copy } = useClipboard();

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      toast.error("请输入内容");
      return;
    }

    const result = convertFormat(input, fromFormat, toFormat);
    if (result.success) {
      setOutput(result.data || "");
      setError(undefined);
      toast.success("转换成功");
    } else {
      setError(result.error?.message);
      setOutput("");
      toast.error(result.error?.message || "转换失败");
    }
  }, [input, fromFormat, toFormat]);

  const handleSwapFormats = useCallback(() => {
    setFromFormat(toFormat);
    setToFormat(fromFormat);
    if (output) {
      setInput(output);
      setOutput("");
    }
  }, [fromFormat, toFormat, output]);

  const handleCopy = useCallback(() => {
    if (output) {
      copy(output);
    }
  }, [output, copy]);

  const handleLoadSample = useCallback(() => {
    setFromFormat("json");
    setToFormat("yaml");
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
        <h1 className="text-2xl font-bold">JSON 格式转换</h1>
        <p className="text-muted-foreground mt-1">
          JSON、YAML、CSV 格式互转
        </p>
      </div>

      {/* 格式选择 */}
      <div className="flex items-center gap-3">
        <Select
          value={fromFormat}
          onValueChange={(v) => setFromFormat(v as ConvertFormat)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {formats.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" onClick={handleSwapFormats}>
          <ArrowRight className="h-4 w-4" />
        </Button>

        <Select
          value={toFormat}
          onValueChange={(v) => setToFormat(v as ConvertFormat)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {formats.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleConvert}>
          <ArrowRight className="mr-2 h-4 w-4" />
          转换
        </Button>
        <Button variant="outline" onClick={handleLoadSample}>
          <FileText className="mr-2 h-4 w-4" />
          示例
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          清空
        </Button>
      </div>

      {/* 编辑器区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              输入 ({formats.find((f) => f.value === fromFormat)?.label})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`输入 ${formats.find((f) => f.value === fromFormat)?.label} 数据...`}
              className="min-h-[300px] font-mono text-sm"
            />
            {error && (
              <p className="mt-1 text-xs text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                输出 ({formats.find((f) => f.value === toFormat)?.label})
              </CardTitle>
              {output && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="mr-1 h-3 w-3" />
                  {copied ? "已复制" : "复制"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              readOnly
              placeholder="转换结果将在此显示..."
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
