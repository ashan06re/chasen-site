import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: { '/api/cms-image/*': ['./src/content/cms-assets/**/*'] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      // Baseline CSP: preserves static rendering, maps and Vercel preview tools.
      // This is not a strict script policy; nonce-based CSP needs a separate design.
      { key: 'Content-Security-Policy', value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'" },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
  // Keep static generation bounded. Public pages read the bundled CMS edition.
  experimental: { staticGenerationMaxConcurrency: 1, staticGenerationMinPagesPerWorker: 100 },
  images: {
    // 公開版に固定した写真を /api/cms-image から配信する。
    localPatterns: [
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
