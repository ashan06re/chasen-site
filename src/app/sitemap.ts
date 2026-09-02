import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { localizePath } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ページを追加したらここにも追記する（日本語・英語の両 URL が自動で出る）
  const entries: Array<{ path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }> = [
    { path: "/",                       priority: 1.0, changeFrequency: "weekly"  },
    { path: "/stores/kyoto",           priority: 0.9, changeFrequency: "weekly"  },
    { path: "/stores/kyoto/menu",      priority: 0.8, changeFrequency: "weekly"  },
    { path: "/stores/kumamoto",        priority: 0.9, changeFrequency: "weekly"  },
    { path: "/stores/kumamoto/menu",   priority: 0.8, changeFrequency: "weekly"  },
    { path: "/news",                   priority: 0.7, changeFrequency: "daily"   },
    { path: "/privacy",                priority: 0.2, changeFrequency: "monthly" },
    { path: "/terms",                  priority: 0.2, changeFrequency: "monthly" },
  ];

  return entries.flatMap(({ path, priority, changeFrequency }) => {
    const ja = absoluteUrl(localizePath(path, "ja"));
    const en = absoluteUrl(localizePath(path, "en"));
    const languages = { ja, en, "x-default": ja };
    return [
      { url: ja, lastModified: now, changeFrequency, priority, alternates: { languages } },
      { url: en, lastModified: now, changeFrequency, priority: Math.max(0.1, priority - 0.1), alternates: { languages } },
    ];
  });
}
