// メールアドレス変更ページ

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Email from "@/components/settings/Email"
import Loading from "@/app/loading"

// supabase.auth.getUserでユーザー情報取得
// し，ない場合はトップへリダイレクト
const EmailPage = async () => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  if (!user || !user.email) {
    redirect("/")
  }

  // ローディング画面で時間調整
  return (
    <Suspense fallback={<Loading />}>
      <Email email={user.email} />
    </Suspense>
  )
}

export default EmailPage;
