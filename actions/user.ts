"use server"

import { EmailSchema, ProfileSchema } from "@/schemas"
import { createClient } from "@/utils/supabase/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { ProfileType } from "@/types"
import { decode } from "base64-arraybuffer"

interface updateProfileProps extends z.infer<typeof ProfileSchema> {
  profile: ProfileType
  base64Image: string | undefined
}

// プロフィール更新(supabaseに送信)
export const updateProfile = async (values: updateProfileProps) => {
  try {
    const supabase = createClient()

    let avatar_url = values.profile.avatar_url

    // 画像が64で変換されているか？
    if (values.base64Image) {
      const matches = values.base64Image.match(/^data:(.+);base64,(.+)$/)

      if (!matches || matches.length !== 3) {
        return { error: "無効な画像データです" }
      }

      const contentType = matches[1] //"image/png"
      const base64Data = matches[2] // 64のデータ部
      const fileExt = contentType.split("/")[1] // 拡張子を取得
      const fileName = `${uuidv4()}.${fileExt}` // uuidを使いファイル名を生成

      // 新しい画像をアップロード
      // decodeで画像データをURL変換しDB保存
      const { error: storageError } = await supabase.storage
        .from("profile")
        .upload(`${values.profile.id}/${fileName}`, decode(base64Data), {
          contentType,
        })

      if (storageError) {
        return { error: storageError.message }
      }

      // 既存の画像を削除
      // removeでデータ削除
      // splitは拡張子
      // slice(-1) は配列の末尾を指定し，[0]で要素を取出し
      // 画像URLが列の末尾
      if (avatar_url) {
        const fileName = avatar_url.split("/").slice(-1)[0]
        await supabase.storage
          .from("profile")
          .remove([`${values.profile.id}/${fileName}`])
      }

      // 新しい画像のURLを取得
      const { data: urlData } = await supabase.storage
        .from("profile")
        .getPublicUrl(`${values.profile.id}/${fileName}`)

      avatar_url = urlData.publicUrl
    }

    // プロフィールアップデート
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name: values.name,
        introduce: values.introduce,
        avatar_url,
      })
      .eq("id", values.profile.id)

    // エラーチェック
    if (updateError) {
      return { error: updateError.message }
    }
  } catch (err) {
    console.error(err)
    return { error: "エラーが発生しました" }
  }
}

// メールアドレス変更
export const updateEmail = async (values: z.infer<typeof EmailSchema>) => {
  try {
    const supabase = createClient()

    // メールアドレス変更メールを送信(supabase.auth.updateUserを使う)
    // メールアドレス変更リクエストを送信
    // email: values.email=第1メール
    // emailRedirectTo=第2メール
    const { error: updateUserError } = await supabase.auth.updateUser(
      { email: values.email },
      { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/email/verify` }
    )

    if (updateUserError) {
      return { error: updateUserError.message }
    }

    // ログアウト(メアド変更後に旧メアドでのログインを解除)
    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      return { error: signOutError.message }
    }
  } catch (err) {
    console.error(err)
    return { error: "エラーが発生しました" }
  }
}