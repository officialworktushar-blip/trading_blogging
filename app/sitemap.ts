import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/seo";
import { marketTopics } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/search"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: absoluteUrl("/about-us"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contact-support"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/disclaimer"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...marketTopics.map((topic) => ({
      url: absoluteUrl(`/${topic.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("slug, updated_at, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to build sitemap:", error.message);
      return staticRoutes;
    }

    const postRoutes: MetadataRoute.Sitemap = (data ?? []).map((post) => ({
      url: absoluteUrl(`/blog/${String(post.slug)}`),
      lastModified: new Date(String(post.updated_at ?? post.created_at ?? now)),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticRoutes;
  }
}
