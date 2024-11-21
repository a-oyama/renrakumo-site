// プロフィール設定ページ

"use client"

import { usePathname } from "next/navigation"
import { UserRoundPen, Mail, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

// ナビゲーション
const subNavigation = [
  {
    name: "プロフィール",
    icon: UserRoundPen,
    href: "/settings/profile",
  },
  {
    name: "メールアドレス変更",
    icon: Mail,
    href: "/settings/email",
  },
  {
    name: "パスワード変更",
    icon: KeyRound,
    href: "/settings/password",
  },
]

// レイアウト
const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    // usepassで設定URLをわかりやすくする
  const pathname = usePathname()

  // 画面はプチレスポンシブ
  // リンクをボタンとして扱う
  // ゴーストでハイライト表示
  return (
    <div className="flex flex-col sm:flex-row mx-auto max-w-screen-md">
      {/* グリッド内コンテンツアイテム数 */}
      <div className="grid sm:grid-cols-3 sm:gap-3 w-full sm:w-auto">
        {/* 縦並び */}
        <div className="col-span-1 space-y-2 sm:space-y-0 sm:block">
          {subNavigation.map((item, index) => (
            <Button
              asChild
              key={index}
              variant="ghost"
              className={cn(
                "w-full sm:w-auto sm:justify-start font-bold",
                pathname === item.href && "bg-gray-100"
              )}
            >
              <Link href={item.href}>
                <item.icon className="inline-block w-5 h-5 mr-2" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
        <div className="col-span-2 sm:col-span-2 w-full">{children}</div>
      </div>
    </div>
  )
}

export default SettingsLayout;
