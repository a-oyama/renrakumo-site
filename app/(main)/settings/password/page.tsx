// パスワード変更用ページ

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Password from "@/components/auth/Password"
import Loading from "@/app/loading"

const PasswordPage = async () => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user

  if (!user) {
    redirect("/")
  }

  return (
    <Suspense fallback={<Loading />}>
      <Password />
    </Suspense>
  )
}

export default PasswordPage;
