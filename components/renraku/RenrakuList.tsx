"use client"

import { RenrakuType } from "@/types"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

interface RenrakuListProps {

  renraku: RenrakuType & {
           profiles: {name: string
           avatar_url: string
          }
  }
}

// 画面
const RenrakuList = ({ renraku }: RenrakuListProps) => {

  return (
    <div className="break-words border rounded py-2">

      <Link href={`renraku/${renraku.id}`}>
      <div className="p-3 space-y-2">
        <div className="text-gray-500 text-xs">
          {/* フォーマット関数で更新日時をyyyymmdd HHmmに変換 */}
          {format(new Date(renraku.updated_at), "yyyy/MM/dd HH:mm")}
        </div>
        {/* タイトル */}
        <div className="font-bold">{renraku.title}</div>
        {/* 投稿主のテキスト */}
        <div className="flex items-center space-x-3">
          投稿主
          {/* アイコン */}
          <Image
            src={renraku.profiles.avatar_url || "/default.png"}
            className="rounded-full"
            alt="avatar"
            width={30}
            height={30}
          />
          {/* ユーザー名 */}
          <div className="text-sm">{renraku.profiles.name}</div>
        </div>
      </div>
      </Link>

    </div>
  )
}

export default RenrakuList;
