"use client";

import { useState, useCallback } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClipboard } from "@/hooks/useClipboard";

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return match
    ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export default function ColorPage() {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");
  const [hsl, setHsl] = useState("hsl(217, 91%, 60%)");
  const { copy } = useClipboard();

  const updateFromHex = useCallback((value: string) => {
    setHex(value);
    const rgbVal = hexToRgb(value);
    if (rgbVal) {
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    }
  }, []);

  const updateFromRgb = useCallback((value: string) => {
    setRgb(value);
    const match = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      setHex(rgbToHex(r, g, b));
      const hslVal = rgbToHsl(r, g, b);
      setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
    }
  }, []);

  const updateFromHsl = useCallback((value: string) => {
    setHsl(value);
    const match = value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);
      const rgbVal = hslToRgb(h, s, l);
      setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
    }
  }, []);

  const colorFormats: { label: string; value: string; setter: (v: string) => void }[] = [
    { label: "HEX", value: hex, setter: updateFromHex },
    { label: "RGB", value: rgb, setter: updateFromRgb },
    { label: "HSL", value: hsl, setter: updateFromHsl },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">颜色转换</h1>
        <p className="text-muted-foreground mt-1">
          HEX、RGB、HSL 颜色格式互转
        </p>
      </div>

      {/* 颜色预览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">颜色预览</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-32 rounded-lg border"
            style={{ backgroundColor: hex }}
          />
        </CardContent>
      </Card>

      {/* 颜色输入 */}
      {colorFormats.map((format) => (
        <Card key={format.label}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{format.label}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(format.value)}
              >
                <Copy className="mr-1 h-3 w-3" />
                复制
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Input
              value={format.value}
              onChange={(e) => format.setter(e.target.value)}
              className="font-mono"
            />
          </CardContent>
        </Card>
      ))}

      {/* 颜色选择器 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">颜色选择器</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="color"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full h-12 cursor-pointer rounded-md border"
          />
        </CardContent>
      </Card>
    </div>
  );
}
