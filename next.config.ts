import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Cloudflare Pages 静态导出时禁用图片优化（需要 Sharp）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
