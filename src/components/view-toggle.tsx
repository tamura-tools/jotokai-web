"use client"

import { Button } from "@/components/ui/button"

interface ViewToggleProps {
  value: "list" | "map"
  onChange: (value: "list" | "map") => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 ml-auto">
      <Button
        variant={value === "list" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("list")}
      >
        一覧
      </Button>
      <Button
        variant={value === "map" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("map")}
      >
        地図
      </Button>
    </div>
  )
}
