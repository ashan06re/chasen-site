import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CMS is shared with the live site. Avoid a build-time thundering herd.
  experimental: { staticGenerationMaxConcurrency: 1, staticGenerationMinPagesPerWorker: 100 },
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
