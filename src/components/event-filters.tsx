"use client"

import { useState, useMemo } from "react"
import { EventList } from "./event-list"
import { EventTable } from "./event-table"
import { PrefectureSelect } from "./prefecture-select"
import { AnimalTypeFilter } from "./animal-type-filter"
import { ViewToggle } from "./view-toggle"
import type { MergedEvent } from "@/types/event"
import { exportToCsv } from "@/lib/csv"
import dynamic from "next/dynamic"

const EventMap = dynamic(() => import("./event-map").then((m) => m.EventMap), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-muted animate-pulse rounded-lg" />
  ),
})

export function EventFilters({ events }: { events: MergedEvent[] }) {
  const [prefecture, setPrefecture] = useState<string>("all")
  const [animalType, setAnimalType] = useState<string>("all")
  const [view, setView] = useState<"list" | "map" | "table">("list")

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (prefecture !== "all" && e.prefecture !== prefecture) return false
      if (animalType !== "all" && !e.animal_types?.includes(animalType))
        return false
      return true
    })
  }, [events, prefecture, animalType])

  const availablePrefectures = useMemo(() => {
    return [...new Set(events.map((e) => e.prefecture))].sort()
  }, [events])

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <PrefectureSelect
          value={prefecture}
          onChange={setPrefecture}
          prefectures={availablePrefectures}
        />
        <AnimalTypeFilter value={animalType} onChange={setAnimalType} />
        <ViewToggle value={view} onChange={setView} />
        <button
          onClick={() => exportToCsv(filtered)}
          className="ml-auto text-sm px-3 py-2 border rounded hover:bg-muted transition-colors whitespace-nowrap"
        >
          CSVダウンロード
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length}件表示中
      </p>

      {view === "list" ? (
        <EventList events={filtered} />
      ) : view === "table" ? (
        <EventTable events={filtered} />
      ) : (
        <EventMap events={filtered} />
      )}
    </div>
  )
}
