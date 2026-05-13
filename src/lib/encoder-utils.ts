/**
 * Base64 编码
 */
export function base64Encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

/**
 * Base64 解码
 */
export function base64Decode(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

/**
 * URL 编码
 */
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

/**
 * URL 解码
 */
export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

/**
 * Unicode 编码
 */
export function unicodeEncode(input: string): string {
  return Array.from(input)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code > 127) {
        return `\\u${code.toString(16).padStart(4, "0")}`;
      }
      return char;
    })
    .join("");
}

/**
 * Unicode 解码
 */
export function unicodeDecode(input: string): string {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

/**
 * HTML 实体编码
 */
export function htmlEncode(input: string): string {
  const entityMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
  };
  return input.replace(/[&<>"'/]/g, (char) => entityMap[char]);
}

/**
 * HTML 实体解码
 */
export function htmlDecode(input: string): string {
  const entityMap: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x2F;": "/",
  };
  return input.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g, (entity) => entityMap[entity]);
}

export type EncoderType = "base64" | "url" | "unicode" | "html";

export function encode(type: EncoderType, input: string): string {
  switch (type) {
    case "base64":
      return base64Encode(input);
    case "url":
      return urlEncode(input);
    case "unicode":
      return unicodeEncode(input);
    case "html":
      return htmlEncode(input);
  }
}

export function decode(type: EncoderType, input: string): string {
  switch (type) {
    case "base64":
      return base64Decode(input);
    case "url":
      return urlDecode(input);
    case "unicode":
      return unicodeDecode(input);
    case "html":
      return htmlDecode(input);
  }
}
