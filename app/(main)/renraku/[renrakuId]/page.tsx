import { createClient } from "@/utils/supabase/server"
import RenrakuDetail from "@/components/renraku/RenrakuDetail"
import { Suspense } from "react"
import Loading from "@/app/loading"

// paramsでオブジェクト(記事)Idを指定
interface RenrakuDetailPageProps {
  params: {
    renrakuId: string
  }
}

const RenrakuDetailPage = async ({ params }: RenrakuDetailPageProps) => {
  const { renrakuId } = params
 
  // supabase連携
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  // ブログ詳細取得
  const { data: renrakuData } = await supabase
    .from("blogs")
    .select(`*,profiles (name, avatar_url, introduce)`)
    .eq("id", renrakuId)
    .single()//記事1つ

  if (!renrakuData) {
    return <div className="text-center">連絡記事が存在しません</div>
  }

  // ログインユーザーidと記事作成者idが合致しているか
  // 同じ=true 異なる=falseをisMyRenrakuに格納
  const isMyRenraku = user?.id === renrakuData.user_id

  return (
    <Suspense fallback={<Loading />}>
      <RenrakuDetail renraku={renrakuData} isMyRenraku={isMyRenraku} />
    </Suspense>
  )
}

export default RenrakuDetailPage;