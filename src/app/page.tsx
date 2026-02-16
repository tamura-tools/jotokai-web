import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EventFilters } from "@/components/event-filters"
import type { MergedEvent } from "@/types/event"

export const revalidate = 600

async function getEvents(): Promise<MergedEvent[]> {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("v_events_merged")
    .select("*")
    .gte("event_date", today)
    .order("event_date", { ascending: true })

  if (error) {
    console.error("Failed to fetch events:", error)
    return []
  }
  return data as MergedEvent[]
}

export default async function HomePage() {
  const events = await getEvents()

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">譲渡会イベント一覧</h1>
      <p className="text-muted-foreground mb-6">
        {events.length}件のイベントが見つかりました
      </p>
      <EventFilters events={events} />
    </main>
  )
}
