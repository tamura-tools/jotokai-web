"use client"

import { useState, useMemo } from "react"
import { EventList } from "./event-list"
import { PrefectureSelect } from "./prefecture-select"
import { AnimalTypeFilter } from "./animal-type-filter"
import { ViewToggle } from "./view-toggle"
import type { MergedEvent } from "@/types/event"
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
  const [view, setView] = useState<"list" | "map">("list")

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
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length}件表示中
      </p>

      {view === "list" ? (
        <EventList events={filtered} />
      ) : (
        <EventMap events={filtered} />
      )}
    </div>
  )
}
