// サインアップページ

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Signup from "@/components/auth/Signup"

const SignupPage = async () => {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user

  // ログイン済はトップ，してないはサインアップページへ
  if (user) {
    redirect("/")
  }

  return <Signup />
}

export default SignupPage;
