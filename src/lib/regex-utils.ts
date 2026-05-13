export interface MatchResult {
  index: number;
  length: number;
  text: string;
  groups?: Record<string, string>;
}

export interface RegexTestResult {
  valid: boolean;
  matches: MatchResult[];
  error?: string;
}

/**
 * 测试正则表达式
 */
export function testRegex(
  pattern: string,
  flags: string,
  text: string
): RegexTestResult {
  if (!pattern) {
    return { valid: true, matches: [] };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: MatchResult[] = [];

    if (flags.includes("g")) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          groups: match.groups ? { ...match.groups } : undefined,
        });
        // 防止无限循环
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          groups: match.groups ? { ...match.groups } : undefined,
        });
      }
    }

    return { valid: true, matches };
  } catch (e) {
    return {
      valid: false,
      matches: [],
      error: e instanceof Error ? e.message : "正则表达式语法错误",
    };
  }
}

/**
 * 高亮匹配文本
 */
export function highlightMatches(
  text: string,
  matches: MatchResult[]
): { text: string; highlight: boolean }[] {
  if (matches.length === 0) {
    return [{ text, highlight: false }];
  }

  const result: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;

  // 按位置排序
  const sorted = [...matches].sort((a, b) => a.index - b.index);

  for (const match of sorted) {
    if (match.index > lastIndex) {
      result.push({
        text: text.slice(lastIndex, match.index),
        highlight: false,
      });
    }
    result.push({
      text: match.text,
      highlight: true,
    });
    lastIndex = match.index + match.length;
  }

  if (lastIndex < text.length) {
    result.push({
      text: text.slice(lastIndex),
      highlight: false,
    });
  }

  return result;
}

export interface RegexFlag {
  flag: string;
  label: string;
  description: string;
}

export const regexFlags: RegexFlag[] = [
  { flag: "g", label: "全局", description: "全局匹配" },
  { flag: "i", label: "忽略大小写", description: "不区分大小写" },
  { flag: "m", label: "多行", description: "多行模式" },
  { flag: "s", label: "点号匹配换行", description: "dotAll 模式" },
];

export interface RegexTemplate {
  name: string;
  pattern: string;
  flags: string;
  description: string;
  example: string;
}

export const regexTemplates: RegexTemplate[] = [
  {
    name: "邮箱",
    pattern: "[\\w.-]+@[\\w.-]+\\.\\w+",
    flags: "g",
    description: "匹配邮箱地址",
    example: "test@example.com",
  },
  {
    name: "手机号",
    pattern: "1[3-9]\\d{9}",
    flags: "g",
    description: "匹配中国大陆手机号",
    example: "13812345678",
  },
  {
    name: "URL",
    pattern: "https?://[^\\s]+",
    flags: "g",
    description: "匹配 HTTP/HTTPS URL",
    example: "https://example.com/path",
  },
  {
    name: "IP 地址",
    pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
    flags: "g",
    description: "匹配 IPv4 地址",
    example: "192.168.1.1",
  },
  {
    name: "日期",
    pattern: "\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}",
    flags: "g",
    description: "匹配日期格式",
    example: "2024-01-15",
  },
  {
    name: "十六进制颜色",
    pattern: "#[0-9a-fA-F]{3,8}",
    flags: "g",
    description: "匹配 HEX 颜色值",
    example: "#ff5733",
  },
];
