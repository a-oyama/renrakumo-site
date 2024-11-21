// ログインページ

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import Login from "@/components/auth/Login"

const LoginPage = async () => {
  // ↓supabaseクライアント使用し，ユーザー情報取得し，ログイン済かチェック  
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  // userが存在している or してない　状態を格納
  const user = data?.user

  // すでにログイン済はトップへ，してない場合はログインページへ
  if (user) {
    redirect("/")
  }

  return <Login />
}

export default LoginPage;
