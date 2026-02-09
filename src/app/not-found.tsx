import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-24 max-w-5xl text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">
        ページが見つかりませんでした
      </p>
      <Button asChild>
        <Link href="/">トップページに戻る</Link>
      </Button>
    </main>
  )
}
