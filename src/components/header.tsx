import Link from "next/link"
import { SITE_NAME } from "@/lib/constants"

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            一覧
          </Link>
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
            Web検索
          </Link>
        </nav>
      </div>
    </header>
  )
}
