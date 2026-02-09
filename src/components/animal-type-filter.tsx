"use client"

import { Button } from "@/components/ui/button"
import { ANIMAL_TYPES } from "@/lib/constants"

interface AnimalTypeFilterProps {
  value: string
  onChange: (value: string) => void
}

export function AnimalTypeFilter({ value, onChange }: AnimalTypeFilterProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant={value === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("all")}
      >
        すべて
      </Button>
      {ANIMAL_TYPES.map((type) => (
        <Button
          key={type}
          variant={value === type ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(type)}
        >
          {type}
        </Button>
      ))}
    </div>
  )
}
