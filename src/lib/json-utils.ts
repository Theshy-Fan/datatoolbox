import yaml from "js-yaml";
import Papa from "papaparse";

export interface JsonError {
  message: string;
  line?: number;
  column?: number;
}

export interface FormatResult {
  success: boolean;
  data?: string;
  error?: JsonError;
}

/**
 * 格式化 JSON 字符串
 */
export function formatJson(input: string, indent: number = 2): FormatResult {
  if (!input.trim()) {
    return { success: true, data: "" };
  }

  try {
    const parsed = JSON.parse(input);
    return { success: true, data: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return {
      success: false,
      error: parseJsonError(e, input),
    };
  }
}

/**
 * 压缩 JSON 字符串
 */
export function minifyJson(input: string): FormatResult {
  if (!input.trim()) {
    return { success: true, data: "" };
  }

  try {
    const parsed = JSON.parse(input);
    return { success: true, data: JSON.stringify(parsed) };
  } catch (e) {
    return {
      success: false,
      error: parseJsonError(e, input),
    };
  }
}

/**
 * 校验 JSON 字符串
 */
export function validateJson(input: string): { valid: boolean; error?: JsonError } {
  if (!input.trim()) {
    return { valid: true };
  }

  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    return {
      valid: false,
      error: parseJsonError(e, input),
    };
  }
}

/**
 * 解析 JSON 错误信息，尝试提取行号
 */
function parseJsonError(e: unknown, input: string): JsonError {
  const message = e instanceof Error ? e.message : "未知错误";

  // 尝试从错误信息中提取位置
  const positionMatch = message.match(/position\s+(\d+)/i);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const { line, column } = getPositionFromIndex(input, position);
    return { message, line, column };
  }

  // 尝试提取行号
  const lineMatch = message.match(/line\s+(\d+)/i);
  const columnMatch = message.match(/column\s+(\d+)/i);
  if (lineMatch) {
    return {
      message,
      line: parseInt(lineMatch[1], 10),
      column: columnMatch ? parseInt(columnMatch[1], 10) : undefined,
    };
  }

  return { message };
}

/**
 * 从字符串索引计算行号和列号
 */
function getPositionFromIndex(
  input: string,
  index: number
): { line: number; column: number } {
  const lines = input.slice(0, index).split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * 统计 JSON 信息
 */
export function getJsonStats(input: string): {
  size: number;
  keys: number;
  depth: number;
} | null {
  try {
    const parsed = JSON.parse(input);
    const size = new TextEncoder().encode(input).length;
    let keys = 0;
    let maxDepth = 0;

    function traverse(value: unknown, depth: number) {
      if (depth > maxDepth) maxDepth = depth;

      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          value.forEach((item) => traverse(item, depth + 1));
        } else {
          const obj = value as Record<string, unknown>;
          const objKeys = Object.keys(obj);
          keys += objKeys.length;
          objKeys.forEach((key) => traverse(obj[key], depth + 1));
        }
      }
    }

    traverse(parsed, 0);
    return { size, keys, depth: maxDepth };
  } catch {
    return null;
  }
}

// ========== 格式转换 ==========

export type ConvertFormat = "json" | "yaml" | "csv";

/**
 * JSON 转 YAML
 */
export function jsonToYaml(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input);
    return { success: true, data: yaml.dump(parsed, { indent: 2 }) };
  } catch (e) {
    return { success: false, error: { message: e instanceof Error ? e.message : "转换失败" } };
  }
}

/**
 * YAML 转 JSON
 */
export function yamlToJson(input: string): FormatResult {
  try {
    const parsed = yaml.load(input);
    return { success: true, data: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { success: false, error: { message: e instanceof Error ? e.message : "YAML 解析失败" } };
  }
}

/**
 * JSON 转 CSV（仅支持对象数组）
 */
export function jsonToCsv(input: string): FormatResult {
  try {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) {
      return { success: false, error: { message: "JSON 转 CSV 需要输入数组格式" } };
    }
    const csv = Papa.unparse(parsed);
    return { success: true, data: csv };
  } catch (e) {
    return { success: false, error: { message: e instanceof Error ? e.message : "转换失败" } };
  }
}

/**
 * CSV 转 JSON
 */
export function csvToJson(input: string): FormatResult {
  try {
    const result = Papa.parse(input, { header: true, skipEmptyLines: true });
    if (result.errors.length > 0) {
      return { success: false, error: { message: result.errors[0].message } };
    }
    return { success: true, data: JSON.stringify(result.data, null, 2) };
  } catch (e) {
    return { success: false, error: { message: e instanceof Error ? e.message : "CSV 解析失败" } };
  }
}

/**
 * 通用格式转换
 */
export function convertFormat(
  input: string,
  from: ConvertFormat,
  to: ConvertFormat
): FormatResult {
  if (from === to) {
    return { success: true, data: input };
  }

  // 先转为 JSON
  let json: string;
  if (from === "yaml") {
    const result = yamlToJson(input);
    if (!result.success) return result;
    json = result.data!;
  } else if (from === "csv") {
    const result = csvToJson(input);
    if (!result.success) return result;
    json = result.data!;
  } else {
    json = input;
  }

  // 再转为目标格式
  if (to === "yaml") return jsonToYaml(json);
  if (to === "csv") return jsonToCsv(json);
  return { success: true, data: json };
}
