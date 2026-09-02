import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Notion画像は /api/notion-image プロキシ経由（署名付きURLの失効対策）
    localPatterns: [
      { pathname: "/api/notion-image/**", search: "" },
      { pathname: "/**", search: "" },
    ],
    remotePatterns: [
      // Notion にアップロードした写真の配信元（全リージョン対応）
      { protocol: "https", hostname: "*.s3.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
      { protocol: "https", hostname: "*.notion.so" },
    ],
  },
};

export default nextConfig;
