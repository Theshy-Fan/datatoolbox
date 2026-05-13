import {
  Braces,
  TreePine,
  ArrowRightLeft,
  Binary,
  Regex,
  Clock,
  Palette,
  Hash,
  IdCard,
  type LucideIcon,
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: string;
}

export const toolCategories = [
  { id: "json", name: "JSON 工具" },
  { id: "encoder", name: "编码解码" },
  { id: "converter", name: "格式转换" },
  { id: "regex", name: "正则表达式" },
  { id: "generator", name: "生成器" },
] as const;

export const tools: Tool[] = [
  // JSON 工具
  {
    id: "json-formatter",
    name: "JSON 格式化",
    description: "格式化、压缩、校验 JSON 数据",
    href: "/json",
    icon: Braces,
    category: "json",
  },
  {
    id: "json-tree",
    name: "JSON 树形展示",
    description: "以可折叠的树形结构可视化 JSON",
    href: "/json/tree",
    icon: TreePine,
    category: "json",
  },
  {
    id: "json-converter",
    name: "JSON 格式转换",
    description: "JSON 与 CSV、YAML 互转",
    href: "/json/converter",
    icon: ArrowRightLeft,
    category: "json",
  },
  // 编码解码
  {
    id: "encoder",
    name: "编码解码",
    description: "Base64、URL、Unicode、HTML 实体编解码",
    href: "/encoder",
    icon: Binary,
    category: "encoder",
  },
  // 正则表达式
  {
    id: "regex",
    name: "正则表达式测试",
    description: "实时匹配、高亮、分组展示",
    href: "/regex",
    icon: Regex,
    category: "regex",
  },
  // 生成器
  {
    id: "timestamp",
    name: "时间戳转换",
    description: "Unix 时间戳与日期字符串互转",
    href: "/converter/timestamp",
    icon: Clock,
    category: "converter",
  },
  {
    id: "color",
    name: "颜色转换",
    description: "HEX、RGB、HSL 颜色格式互转",
    href: "/converter/color",
    icon: Palette,
    category: "converter",
  },
  {
    id: "hash",
    name: "哈希计算",
    description: "MD5、SHA256 哈希值计算",
    href: "/generator/hash",
    icon: Hash,
    category: "generator",
  },
  {
    id: "uuid",
    name: "UUID 生成",
    description: "生成随机 UUID v4",
    href: "/generator/uuid",
    icon: IdCard,
    category: "generator",
  },
];

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}
