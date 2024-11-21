// ヘッダーに表示する内容

"use client"

import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

// いる or いない
interface NavigationProps {
  user: User | null
}

// ナビゲーション(userを受け取りログイン状態に応じて表示リンク変更)
const Navigation = ({ user }: NavigationProps) => {

  const router = useRouter()
  const supabase = createClient()

  // ログアウト時にsubpabaseセッションアウトしloginページに戻す
  const handleLogout = async () => {
    if (!window.confirm("ログアウトしますが、宜しいですか？")) {
      return
    }

    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // ヘッダー部
  return (
    <header className="border-b">
      <div className="mx-auto max-w-screen-lg px-2 py-5 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          連絡網サイト
        </Link>

        {/* user引継ぎの場合にリンク表示 */}
        <div className="text-sm font-bold">

          {user ? (/* ログインしている */
            <div className="flex items-center space-x-5">
              <Link href="/renraku/new">
                <div>記事作成</div>
              </Link>

              <Link href="/settings/profile">
                <div>設定</div>
              </Link>

              <div className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </div>
            </div>
          ) : (/* ログインしていない */
            <div className="flex items-center space-x-5">
              <Link href="/login">ログイン</Link>
              <Link href="/signup">アカウント登録</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navigation;