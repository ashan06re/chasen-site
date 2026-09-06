import type { MetadataRoute } from "next";
import { absoluteUrl, IS_PREVIEW } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Menu images are public content; crawlers must be able to fetch them.
        disallow: [],
      },
    ],
    sitemap: IS_PREVIEW ? undefined : absoluteUrl("/sitemap.xml"),
  };
}
