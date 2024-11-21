// 記事投稿認証用

import { createClient } from "@/utils/supabase/server"
// 認証できなかったらリダイレクト
import { redirect } from "next/navigation"
// アニメーション
import { Suspense } from "react"
import Loading from "@/app/loading"
// 記事編集ページ
import NewRenraku from "@/components/renraku/NewRenraku"


// supabase連携
const RenrakuNewPage = async () => {

  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  //else
  if (!user) {
    redirect("/")
  }

  // userid取得(サスペンドしたらアニメ・しなかったら認証)
  return (
    <Suspense fallback={<Loading />}>
      <NewRenraku userId={user.id} />
    </Suspense>
  )
}

export default RenrakuNewPage;
