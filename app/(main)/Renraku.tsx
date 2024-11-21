// メインページ内の連絡記事リスト

import { createClient } from "@/utils/supabase/client"
import RenrakuList from "@/components/renraku/RenrakuList"
import { Suspense } from "react"
import Loading from "@/app/loading"

// メインページ
const RenrakuPage = async () => {

  const supabase = createClient()

  // supabaseからblogテーブル取得
  // ブログデータをorder byで降順(最新のものが上)
  // BlogsDataを定義し，returnで表示
  const { data: blogsData, error } = await supabase
    .from("blogs")

    // profileテーブルのname, avatar をselect(昇順)
    .select(`*, profiles (name,avatar_url)`)
    .order("updated_at", { ascending: false })

  if (!blogsData || error) {
    return <div className="text-center">
      連絡が投稿されていません
      </div>
  }

  // 連絡一覧表示
  // RenrakuListにkey & renraku を渡し，画面に内容表示
  // mapで1件ずつ連絡記事データ取得
  return (
    <Suspense fallback={<Loading />}>
      <div className="">
        {blogsData.map((blog) => 
        {
          return <RenrakuList 
          key={blog.id} renraku={blog}
           />
        })}
      </div>
    </Suspense>
  )
}

export default RenrakuPage;
