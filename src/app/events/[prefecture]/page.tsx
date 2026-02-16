import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EventFilters } from "@/components/event-filters"
import { PREFECTURES } from "@/lib/constants"
import type { MergedEvent } from "@/types/event"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const revalidate = 600

type Props = {
  params: Promise<{ prefecture: string }>
}

export async function generateStaticParams() {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const { data } = await supabase
    .from("v_events_merged")
    .select("prefecture")
    .gte("event_date", today)

  const prefs = [...new Set(data?.map((d) => d.prefecture) ?? [])]
  return prefs.map((p) => ({ prefecture: p }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture } = await params
  const pref = decodeURIComponent(prefecture)
  return {
    title: `${pref}の譲渡会イベント`,
    description: `${pref}で開催予定のペット（犬・猫）譲渡会イベント一覧。日程・会場・団体情報をまとめて確認できます。`,
  }
}

async function getEventsByPrefecture(
  prefecture: string
): Promise<MergedEvent[]> {
  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("v_events_merged")
    .select("*")
    .eq("prefecture", prefecture)
    .gte("event_date", today)
    .order("event_date", { ascending: true })

  if (error) {
    console.error("Failed to fetch events:", error)
    return []
  }
  return data as MergedEvent[]
}

export default async function PrefecturePage({ params }: Props) {
  const { prefecture } = await params
  const pref = decodeURIComponent(prefecture)

  if (!PREFECTURES.includes(pref as (typeof PREFECTURES)[number])) {
    notFound()
  }

  const events = await getEventsByPrefecture(pref)

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">{pref}の譲渡会イベント</h1>
      <p className="text-muted-foreground mb-6">
        {events.length}件のイベントが見つかりました
      </p>
      <EventFilters events={events} />
    </main>
  )
}
