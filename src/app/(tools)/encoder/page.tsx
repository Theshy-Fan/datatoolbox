"use client";

import { useState, useCallback } from "react";
import { ArrowRight, ArrowLeft, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/useClipboard";
import { encode, decode, type EncoderType } from "@/lib/encoder-utils";

const encoderTypes: { value: EncoderType; label: string }[] = [
  { value: "base64", label: "Base64" },
  { value: "url", label: "URL" },
  { value: "unicode", label: "Unicode" },
  { value: "html", label: "HTML 实体" },
];

export default function EncoderPage() {
  const [type, setType] = useState<EncoderType>("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { copied, copy } = useClipboard();

  const handleEncode = useCallback(() => {
    try {
      const result = encode(type, input);
      setOutput(result);
    } catch {
      setOutput("编码失败：输入数据格式错误");
    }
  }, [type, input]);

  const handleDecode = useCallback(() => {
    try {
      const result = decode(type, input);
      setOutput(result);
    } catch {
      setOutput("解码失败：输入数据格式错误");
    }
  }, [type, input]);

  const handleCopy = useCallback(() => {
    if (output && !output.startsWith("编码失败") && !output.startsWith("解码失败")) {
      copy(output);
    }
  }, [output, copy]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
  }, []);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput("");
  }, [output]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">编码解码</h1>
        <p className="text-muted-foreground mt-1">
          支持 Base64、URL、Unicode、HTML 实体编解码
        </p>
      </div>

      {/* 编码类型选择 */}
      <Tabs
        value={type}
        onValueChange={(v) => setType(v as EncoderType)}
      >
        <TabsList>
          {encoderTypes.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleEncode}>
          <ArrowRight className="mr-2 h-4 w-4" />
          编码
        </Button>
        <Button variant="secondary" onClick={handleDecode}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          解码
        </Button>
        <Button variant="outline" onClick={handleSwap}>
          交换输入输出
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
            <CardTitle className="text-base">输入</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入要编码或解码的内容..."
              className="min-h-[250px] font-mono text-sm"
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
            <Textarea
              value={output}
              readOnly
              placeholder="结果将在此显示..."
              className="min-h-[250px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
