"use client";

import { useState, useMemo } from "react";
import { FileText, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  testRegex,
  highlightMatches,
  regexFlags,
  regexTemplates,
} from "@/lib/regex-utils";

export default function RegexPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");

  const result = useMemo(
    () => testRegex(pattern, flags, testText),
    [pattern, flags, testText]
  );

  const highlighted = useMemo(
    () => highlightMatches(testText, result.matches),
    [testText, result.matches]
  );

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag)
        ? prev.replace(flag, "")
        : prev + flag
    );
  };

  const loadTemplate = (template: (typeof regexTemplates)[0]) => {
    setPattern(template.pattern);
    setFlags(template.flags);
    setTestText(template.example);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">正则表达式测试</h1>
        <p className="text-muted-foreground mt-1">
          实时匹配、高亮、分组展示
        </p>
      </div>

      {/* 正则输入 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">正则表达式</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-muted-foreground font-mono">
                /
              </span>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="输入正则表达式..."
                className="pl-7 pr-7 font-mono"
              />
              <span className="absolute right-3 top-2.5 text-muted-foreground font-mono">
                /
              </span>
            </div>
            <Input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="标志"
              className="w-20 font-mono"
            />
          </div>

          {/* 标志选择 */}
          <div className="flex flex-wrap gap-2">
            {regexFlags.map((f) => (
              <Tooltip key={f.flag}>
                <TooltipTrigger
                  render={
                    <Button
                      variant={flags.includes(f.flag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFlag(f.flag)}
                    />
                  }
                >
                  {f.flag} {f.label}
                </TooltipTrigger>
                <TooltipContent>{f.description}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          {result.error && (
            <p className="text-sm text-destructive">{result.error}</p>
          )}
        </CardContent>
      </Card>

      {/* 测试文本 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">测试文本</CardTitle>
            {result.matches.length > 0 && (
              <Badge variant="secondary">
                {result.matches.length} 个匹配
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="输入要测试的文本..."
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* 匹配高亮 */}
      {testText && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">匹配结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-md bg-muted/50 font-mono text-sm whitespace-pre-wrap break-all min-h-[100px]">
              {result.matches.length > 0 ? (
                highlighted.map((part, i) =>
                  part.highlight ? (
                    <mark
                      key={i}
                      className="bg-primary/20 text-primary rounded px-0.5"
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )
              ) : (
                <span className="text-muted-foreground">
                  {pattern ? "无匹配结果" : "输入正则表达式后将在此显示匹配结果"}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 匹配详情 */}
      {result.matches.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">匹配详情</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.matches.map((match, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/50"
                >
                  <Badge variant="outline">{i + 1}</Badge>
                  <code className="flex-1 font-mono text-sm">
                    &quot;{match.text}&quot;
                  </code>
                  <span className="text-xs text-muted-foreground">
                    位置: {match.index}
                  </span>
                  {match.groups && (
                    <div className="flex gap-1">
                      {Object.entries(match.groups).map(([key, value]) => (
                        <Badge key={key} variant="secondary">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 常用模板 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">常用模板</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {regexTemplates.map((template) => (
              <Button
                key={template.name}
                variant="outline"
                className="justify-start"
                onClick={() => loadTemplate(template)}
              >
                <FileText className="mr-2 h-4 w-4" />
                {template.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
