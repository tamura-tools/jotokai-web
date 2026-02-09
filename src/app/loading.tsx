import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-5 w-48 mb-6" />
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-9 w-[180px]" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    </main>
  )
}
