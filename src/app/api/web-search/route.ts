import { NextRequest, NextResponse } from "next/server"

// Gemini APIレスポンスの型定義
interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

// Google Custom Search APIレスポンスの型定義
interface GoogleSearchItem {
  title?: string
  link?: string
  snippet?: string
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[]
}

// 抽出イベントの型定義
interface SearchEvent {
  eventDate: string
  startTime: string | null
  endTime: string | null
  prefecture: string
  address: string | null
  venueName: string | null
  orgName: string
  animalType: string | null
  sourceUrl: string
}

interface GeminiExtractResult {
  found: boolean
  events: SearchEvent[]
}

// HTMLからテキストを抽出するユーティリティ
function extractTextFromHtml(html: string): string {
  // <script> タグを除去
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  // <style> タグを除去
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
  // HTMLタグを除去
  text = text.replace(/<[^>]+>/g, " ")
  // 連続する空白・改行を整理
  text = text.replace(/\s+/g, " ").trim()
  // 最大10000文字に制限
  return text.slice(0, 10000)
}

// AbortControllerでタイムアウト付きfetch
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 0 },
    })
    const html = await response.text()
    return html
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function POST(request: NextRequest) {
  // 環境変数チェック
  const googleApiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY
  const googleCx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID
  const geminiApiKey = process.env.GEMINI_API_KEY

  if (!googleApiKey || !googleCx || !geminiApiKey) {
    return NextResponse.json(
      { success: false, error: "API keys not configured" },
      { status: 500 }
    )
  }

  // リクエストボディからクエリを取得
  let query: string
  try {
    const body = await request.json()
    query = body.query as string
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "クエリが指定されていません" },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "リクエストの形式が正しくありません" },
      { status: 400 }
    )
  }

  // 当月・翌月を取得して検索クエリを構築
  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1
  const nextMonthDate = new Date(thisYear, now.getMonth() + 1, 1)
  const nextYear = nextMonthDate.getFullYear()
  const nextMonth = nextMonthDate.getMonth() + 1

  const searchQuery = `${query} 譲渡会 ${thisYear}年${thisMonth}月 OR ${nextYear}年${nextMonth}月`

  // Google Custom Search API を呼び出す
  let searchItems: GoogleSearchItem[] = []
  try {
    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1")
    searchUrl.searchParams.set("key", googleApiKey)
    searchUrl.searchParams.set("cx", googleCx)
    searchUrl.searchParams.set("q", searchQuery)
    searchUrl.searchParams.set("num", "5")
    searchUrl.searchParams.set("lr", "lang_ja")

    const searchRes = await fetch(searchUrl.toString(), { next: { revalidate: 0 } })
    if (!searchRes.ok) {
      const errText = await searchRes.text()
      return NextResponse.json(
        { success: false, error: `Google検索APIエラー: ${searchRes.status} ${errText}` },
        { status: 500 }
      )
    }
    const searchData = (await searchRes.json()) as GoogleSearchResponse
    searchItems = searchData.items ?? []
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Google検索APIへの接続エラー: ${String(err)}` },
      { status: 500 }
    )
  }

  // 最大3件のURLからHTMLを取得してテキスト化
  const targetItems = searchItems.slice(0, 3)
  const pageContents: Array<{ title: string; url: string; content: string }> = []

  for (const item of targetItems) {
    const url = item.link
    if (!url) continue
    try {
      const html = await fetchWithTimeout(url, 5000)
      const text = extractTextFromHtml(html)
      pageContents.push({
        title: item.title ?? "",
        url,
        content: text,
      })
    } catch {
      // タイムアウトやネットワークエラーはスキップ
      pageContents.push({
        title: item.title ?? "",
        url,
        content: item.snippet ?? "",
      })
    }
  }

  // 今日の日付
  const todayStr = now.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Geminiに渡す検索結果テキストを構築
  const searchResultsText = pageContents
    .map(
      (p, i) =>
        `--- 検索結果 ${i + 1} ---\nタイトル: ${p.title}\nURL: ${p.url}\n本文:\n${p.content}`
    )
    .join("\n\n")

  // Gemini Flash でJSON抽出
  const prompt = `以下の検索結果から、今後の犬猫譲渡会情報を抽出してください。

【検索キーワード】: ${query}

${searchResultsText}

【現在の日時】: ${todayStr}
【抽出ルール】
1. 今日以降のイベントのみ
2. 複数イベントがある場合はすべて抽出（最大10件）
3. 都道府県は必ず特定する
4. 年が不明な場合は直近の該当年と推定する

【出力形式】必ずJSONのみ（他のテキスト不要）:
{
  "found": true,
  "events": [
    {
      "eventDate": "YYYY-MM-DD",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "prefecture": "都道府県名",
      "address": "詳細住所",
      "venueName": "会場名",
      "orgName": "団体名",
      "animalType": "犬のみ/猫のみ/犬猫両方",
      "sourceUrl": "情報元URL"
    }
  ]
}
見つからない場合: { "found": false, "events": [] }`

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
      next: { revalidate: 0 },
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      return NextResponse.json(
        { success: false, error: `Gemini APIエラー: ${geminiRes.status} ${errText}` },
        { status: 500 }
      )
    }

    const geminiData = (await geminiRes.json()) as GeminiResponse
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

    // ```json ... ``` のコードブロックを除去してJSONパース
    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim()

    let result: GeminiExtractResult
    try {
      result = JSON.parse(jsonText) as GeminiExtractResult
    } catch {
      // パースエラーは空配列で返す
      result = { found: false, events: [] }
    }

    return NextResponse.json({
      success: true,
      events: result.events ?? [],
      searchQuery,
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Gemini APIへの接続エラー: ${String(err)}` },
      { status: 500 }
    )
  }
}
