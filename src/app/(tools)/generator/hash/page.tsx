"use client";

import { useState, useCallback } from "react";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClipboard } from "@/hooks/useClipboard";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

async function computeHash(
  algorithm: HashAlgorithm,
  data: string
): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  let algo: string;
  switch (algorithm) {
    case "MD5":
      // MD5 不被 Web Crypto API 支持，使用简单实现
      return md5(data);
    case "SHA-1":
      algo = "SHA-1";
      break;
    case "SHA-256":
      algo = "SHA-256";
      break;
    case "SHA-512":
      algo = "SHA-512";
      break;
  }

  const hashBuffer = await crypto.subtle.digest(algo, dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 简单的 MD5 实现
function md5(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(
    q: number,
    a: number,
    b: number,
    x: number,
    s: number,
    t: number
  ) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number
  ) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function gg(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number
  ) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function hh(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number
  ) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    t: number
  ) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md5blk(s: string) {
    const md5blks: number[] = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] =
        s.charCodeAt(i) +
        (s.charCodeAt(i + 1) << 8) +
        (s.charCodeAt(i + 2) << 16) +
        (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  function add32(a: number, b: number) {
    return (a + b) & 0xffffffff;
  }

  let n = string.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;

  for (i = 64; i <= n; i += 64) {
    md5cycle(state, md5blk(string.substring(i - 64, i)));
  }

  string = string.substring(i - 64);
  const tail = new Array(16).fill(0);
  for (i = 0; i < string.length; i++) {
    tail[i >> 2] |= string.charCodeAt(i) << (i % 4 << 3);
  }
  tail[i >> 2] |= 0x80 << (i % 4 << 3);

  if (i > 55) {
    md5cycle(state, tail);
    tail.fill(0);
  }

  tail[14] = n * 8;
  md5cycle(state, tail);

  return state
    .map((s) =>
      ((s >> 0) & 0xff).toString(16).padStart(2, "0") +
      (((s >> 8) & 0xff).toString(16).padStart(2, "0")) +
      (((s >> 16) & 0xff).toString(16).padStart(2, "0")) +
      (((s >> 24) & 0xff).toString(16).padStart(2, "0"))
    )
    .join("");
}

export default function HashPage() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
    MD5: "",
    "SHA-1": "",
    "SHA-256": "",
    "SHA-512": "",
  });
  const { copy } = useClipboard();

  const handleCompute = useCallback(async () => {
    if (!input) return;

    const results: Record<string, string> = {};
    for (const algo of ["MD5", "SHA-1", "SHA-256", "SHA-512"] as HashAlgorithm[]) {
      results[algo] = await computeHash(algo, input);
    }
    setHashes(results as Record<HashAlgorithm, string>);
  }, [input]);

  const algorithms: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">哈希计算</h1>
        <p className="text-muted-foreground mt-1">
          计算字符串的 MD5、SHA-1、SHA-256、SHA-512 哈希值
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">输入</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入要计算哈希的文本..."
            className="min-h-[100px] font-mono"
          />
          <Button onClick={handleCompute}>计算哈希</Button>
        </CardContent>
      </Card>

      {Object.values(hashes).some((h) => h) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">哈希结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {algorithms.map((algo) => (
                <div
                  key={algo}
                  className="flex items-center gap-3 p-3 bg-muted rounded-md"
                >
                  <span className="font-medium w-20">{algo}</span>
                  <code className="flex-1 font-mono text-sm break-all">
                    {hashes[algo] || "-"}
                  </code>
                  {hashes[algo] && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copy(hashes[algo])}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
