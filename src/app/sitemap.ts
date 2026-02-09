import type { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jotokai.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const { data } = await supabase
    .from("v_events_merged")
    .select("prefecture")
    .gte("event_date", today)

  const prefs = [...new Set(data?.map((d) => d.prefecture) ?? [])]

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...prefs.map((p) => ({
      url: `${BASE_URL}/events/${encodeURIComponent(p)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ]
}
