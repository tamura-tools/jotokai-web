const DAY_OF_WEEK_MAP: Record<string, string> = {
  Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土", Sun: "日",
  月: "月", 火: "火", 水: "水", 木: "木", 金: "金", 土: "土", 日: "日",
}

export function formatEventDate(dateStr: string, dayOfWeek?: string | null): string {
  const date = new Date(dateStr + "T00:00:00")
  const month = date.getMonth() + 1
  const day = date.getDate()

  let dow = dayOfWeek
  if (!dow) {
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    dow = days[date.getDay()]
  } else {
    dow = DAY_OF_WEEK_MAP[dow] ?? dow
  }

  return `${month}/${day}（${dow}）`
}

export function formatTime(timeStr: string): string {
  // "HH:MM:SS" or "HH:MM" -> "HH:MM"
  return timeStr.slice(0, 5)
}

export function isWeekend(dateStr: string, dayOfWeek?: string | null): boolean {
  if (dayOfWeek) {
    const dow = DAY_OF_WEEK_MAP[dayOfWeek] ?? dayOfWeek
    return dow === "土" || dow === "日"
  }
  const date = new Date(dateStr + "T00:00:00")
  const d = date.getDay()
  return d === 0 || d === 6
}
