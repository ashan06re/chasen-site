import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
