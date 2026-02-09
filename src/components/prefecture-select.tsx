"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PrefectureSelectProps {
  value: string
  onChange: (value: string) => void
  prefectures: string[]
}

export function PrefectureSelect({
  value,
  onChange,
  prefectures,
}: PrefectureSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="都道府県" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべての都道府県</SelectItem>
        {prefectures.map((pref) => (
          <SelectItem key={pref} value={pref}>
            {pref}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
