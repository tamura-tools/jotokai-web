import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "使い方・よくある質問 | 譲渡会さがし",
  description: "譲渡会さがしの使い方、機能説明、よくある質問をまとめています。",
}

export default function HelpPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">使い方・よくある質問</h1>
      <p className="text-muted-foreground mb-8">
        「譲渡会さがし」の機能と使い方をまとめています。
      </p>

      {/* このサイトについて */}
      <section id="about">
        <h2 className="text-xl font-bold mt-8 mb-3 pb-2 border-b">
          このサイトについて
        </h2>
        <p className="text-sm leading-relaxed">
          「譲渡会さがし」は、日本全国の保護犬・保護猫の譲渡会イベント情報を自動収集し、まとめて掲載しているサイトです。
          各保護団体のWebサイトやSNSから情報を集め、毎日自動更新しています。
        </p>
      </section>

      {/* 情報の収集元 */}
      <section id="sources">
        <h2 className="text-xl font-bold mt-8 mb-3 pb-2 border-b">
          情報の収集元
        </h2>
        <p className="text-sm mb-3">以下のソースから自動的に情報を取得しています。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="bg-muted text-left px-3 py-2 font-medium">ソース</th>
                <th className="bg-muted text-left px-3 py-2 font-medium">内容</th>
                <th className="bg-muted text-left px-3 py-2 font-medium">更新頻度</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b">Hugu</td>
                <td className="px-3 py-2 border-b">全国のペット譲渡会情報</td>
                <td className="px-3 py-2 border-b">毎日</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b">OMUSUBI</td>
                <td className="px-3 py-2 border-b">全国のペット譲渡会情報</td>
                <td className="px-3 py-2 border-b">毎日</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b">ねこじるし</td>
                <td className="px-3 py-2 border-b">猫の譲渡会情報</td>
                <td className="px-3 py-2 border-b">毎日</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b">Instagram</td>
                <td className="px-3 py-2 border-b">各保護団体の公式アカウント</td>
                <td className="px-3 py-2 border-b">週2回（月・木）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm mt-3 text-muted-foreground">
          収集したデータはAIで自動整形・重複排除し、データベースに登録しています。
        </p>
      </section>

      {/* イベント一覧の使い方 */}
      <section id="event-list">
        <h2 className="text-xl font-bold mt-8 mb-3 pb-2 border-b">
          イベント一覧の使い方
        </h2>

        <h3 className="text-base font-semibold mt-4 mb-2">絞り込みフィルタ</h3>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li><span className="font-medium">都道府県</span>: プルダウンから都道府県を選択して絞り込み</li>
          <li><span className="font-medium">動物種別</span>: 「犬」「猫」から選択して絞り込み</li>
        </ul>

        <h3 className="text-base font-semibold mt-4 mb-2">表示の切り替え</h3>
        <p className="text-sm mb-3">右上のボタンで3種類の表示を切り替えられます。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="bg-muted text-left px-3 py-2 font-medium">ボタン</th>
                <th className="bg-muted text-left px-3 py-2 font-medium">説明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border-b">一覧</td>
                <td className="px-3 py-2 border-b">カード形式で見やすく表示</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b">テーブル</td>
                <td className="px-3 py-2 border-b">複数のイベントをまとめて比較しやすい表形式</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border-b">地図</td>
                <td className="px-3 py-2 border-b">地図上でイベントの開催場所を確認</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Web検索機能の使い方 */}
      <section id="web-search">
        <h2 className="text-xl font-bold mt-8 mb-3 pb-2 border-b">
          Web検索機能の使い方
        </h2>
        <p className="text-sm mb-3">
          ヘッダーの「Web検索」からリアルタイムでイベントを検索できます。
        </p>

        <h3 className="text-base font-semibold mt-4 mb-2">使い方</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>団体名・地域名・動物種別などを入力（例:「東京 犬 譲渡会」「〇〇保護団体」）</li>
          <li>「検索」ボタンをクリック</li>
          <li>Google検索の結果をAIが解析してイベント情報を抽出・表示</li>
        </ol>

        <h3 className="text-base font-semibold mt-4 mb-2">ご注意</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>リアルタイムでWebを検索するため、イベント一覧（データベース）とは別のデータが表示されることがあります</li>
          <li>AIが自動で情報を読み取るため、内容に誤りが含まれる場合があります。必ず情報元サイトでご確認ください</li>
          <li>検索回数に上限があるため、1日に何度も同じ検索を繰り返すことはお控えください</li>
        </ul>
      </section>

      {/* よくある質問 */}
      <section id="faq">
        <h2 className="text-xl font-bold mt-8 mb-3 pb-2 border-b">
          よくある質問
        </h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Q. 情報はどのくらいの頻度で更新されますか？</p>
            <p className="text-muted-foreground mt-1">
              A. 毎日自動で更新しています。最新のイベントが表示されない場合は、しばらく時間をおいてから再読み込みしてください。
            </p>
          </div>
          <div>
            <p className="font-medium">Q. 開催時間が「詳細はサイトでご確認ください」と表示される場合は？</p>
            <p className="text-muted-foreground mt-1">
              A. 情報元のサイトに開催時間が記載されていない、または自動取得できなかったためです。リンクをクリックして主催団体のサイトで直接ご確認ください。
            </p>
          </div>
          <div>
            <p className="font-medium">Q. イベントが掲載されていない場合は？</p>
            <p className="text-muted-foreground mt-1">
              A. Web検索機能で団体名を検索してみてください。データベースに未掲載のイベントが見つかることがあります。
            </p>
          </div>
          <div>
            <p className="font-medium">Q. 情報に誤りがある場合は？</p>
            <p className="text-muted-foreground mt-1">
              A. 自動収集・AI整形のため、稀に誤りが含まれる場合があります。必ず情報元サイトまたは主催団体に直接ご確認ください。
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
