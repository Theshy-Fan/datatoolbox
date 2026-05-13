"use client";

import { useState, useMemo } from "react";
import { Search, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/CodeEditor";
import JsonView from "@uiw/react-json-view";

const sampleJson = `{
  "name": "DataToolbox",
  "version": "1.0.0",
  "description": "面向开发者的数据处理工具箱",
  "features": [
    "JSON 格式化",
    "树形展示",
    "格式转换",
    "编码解码",
    "正则测试"
  ],
  "config": {
    "theme": "auto",
    "language": "zh-CN",
    "settings": {
      "fontSize": 14,
      "tabSize": 2,
      "wordWrap": true
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/example/datatoolbox"
  },
  "license": "MIT",
  "active": true,
  "stars": 1250
}`;

export default function JsonTreePage() {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string>();

  const parsedData = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const data = JSON.parse(input);
      setError(undefined);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON 解析错误");
      return null;
    }
  }, [input]);

  // 搜索过滤
  const filteredData = useMemo(() => {
    if (!parsedData || !searchQuery.trim()) return parsedData;

    const query = searchQuery.toLowerCase();

    function filterObject(obj: unknown): unknown {
      if (obj === null || obj === undefined) return obj;

      if (Array.isArray(obj)) {
        const filtered = obj
          .map((item) => filterObject(item))
          .filter((item) => item !== undefined);
        return filtered.length > 0 ? filtered : undefined;
      }

      if (typeof obj === "object") {
        const result: Record<string, unknown> = {};
        let hasMatch = false;

        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
          const keyMatch = key.toLowerCase().includes(query);
          const valueMatch =
            typeof value === "string" && value.toLowerCase().includes(query);
          const nestedValue = filterObject(value);

          if (keyMatch || valueMatch || nestedValue !== undefined) {
            result[key] = value;
            hasMatch = true;
          }
        }

        return hasMatch ? result : undefined;
      }

      if (typeof obj === "string" && obj.toLowerCase().includes(query)) {
        return obj;
      }

      return undefined;
    }

    return filterObject(parsedData) || parsedData;
  }, [parsedData, searchQuery]);

  const handleLoadSample = () => {
    setInput(sampleJson);
    setError(undefined);
  };

  const handleClear = () => {
    setInput("");
    setError(undefined);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">JSON 树形展示</h1>
        <p className="text-muted-foreground mt-1">
          以可折叠的树形结构可视化 JSON 数据
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleLoadSample}>
          <FileText className="mr-2 h-4 w-4" />
          加载示例
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          清空
        </Button>
      </div>

      {/* 内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 输入区 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">输入 JSON</CardTitle>
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

        {/* 树形展示区 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">树形视图</CardTitle>
              {parsedData && (
                <div className="relative w-48">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索键名或值..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {parsedData ? (
              <div className="border rounded-md p-4 max-h-[500px] overflow-auto bg-background">
                <JsonView
                  value={filteredData || parsedData}
                  collapsed={searchQuery ? false : 2}
                  displayDataTypes={false}
                  displayObjectSize={true}
                  enableClipboard={true}
                  style={{
                    backgroundColor: "transparent",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "13px",
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                {error ? "JSON 格式错误" : "输入 JSON 数据后将在此显示树形结构"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
