import { SITE_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4 max-w-5xl">
        <p>&copy; {new Date().getFullYear()} {SITE_NAME}</p>
        <p className="mt-1">
          情報は各サイトから自動収集しています。最新情報は各団体のページをご確認ください。
        </p>
      </div>
    </footer>
  )
}
