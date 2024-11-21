"use client"

import { useState, useTransition } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

import { newRenraku } from "@/actions/renraku"
import { useRouter } from "next/navigation"
// 画像アップ機能
import ImageUploading, { ImageListType } from "react-images-uploading"
// チェック機能
import toast from "react-hot-toast"
import { RenrakuSchema } from "@/schemas"

import Image from "next/image"
import FormError from "@/components/auth/FormError"

interface NewRenrakuProps {
  userId: string
}


const NewRenraku = ({ userId }: NewRenrakuProps) => {

  //  使用コンポーネント
  const router = useRouter()
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const [imageUpload, setImageUpload] = useState<ImageListType>([])

  // title, contentのチェック
  const form = useForm<z.infer<typeof RenrakuSchema>>({
    resolver: zodResolver(RenrakuSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  })

  // フォーム入力内容送信
  const onSubmit = (values: z.infer<typeof RenrakuSchema>) => {
    setError("")

    let base64Image: string | undefined

    // 非同期処理開始(startTransition)
    startTransition(async () => {

      // 画像がない or URLあるか
      try {
        if (imageUpload.length) {
          base64Image = imageUpload[0].dataURL
        }

        const res = await newRenraku({
          ...values,
          base64Image,
          userId,
        })

        // 送信処理成功判定
        if (res?.error) {
          setError(res.error)
          return
        }

        toast.success("連絡を送信しました")
        router.push("/")
        router.refresh()

      } catch (error) {
        console.error(error)
        setError("エラーが発生しました")
      }
    })
  }

  // 画像アップロードをnChangeImageで検証
  const onChangeImage = (imageList: ImageListType) => {
    const file = imageList[0]?.file
    const maxFileSize = 2 * 1024 * 1024

    // ファイルサイズチェック
    if (file && file.size > maxFileSize) {
      setError("ファイルサイズは2MBを超えることはできません")
      return
    }

    setImageUpload(imageList)
  }

  // 画面
  return (
    <div className="mx-auto max-w-screen-md">
      <div className="font-bold text-xl text-center mb-10">記事を作成</div>
      <div className="mb-5">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">タイトル</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">内容</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
                    rows={10}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="py-6">
             <h2 className="font-bold" > 
              添付画像
             </h2>
          </div>

          <ImageUploading
          value={imageUpload}
          onChange={onChangeImage}
          maxNumber={1}
          acceptType={["jpg", "png", "jpeg"]}
        >
          {({ imageList, onImageUpload, onImageUpdate, onImageRemove, dragProps }) => (
            <div className="flex flex-col items-center justify-center">
              {imageList.length == 0 && (
                <button
                onClick={(e) => {
                  e.preventDefault();//大元の動作を妨げる
                  onImageUpload();//クリックで画像フォルダ開く
                }}

                  className="aspect-video w-full border-2 border-dashed rounded hover:bg-gray-50"
                  {...dragProps}
                >
                  {/* 枠内テキスト */}
                  <div className="text-gray-400 font-bold mb-2 text-sm">
                    ファイル選択またはドラッグ＆ドロップ
                  </div>
                  <div className="text-gray-400 text-xs">
                    ファイル形式：jpg / jpeg / png
                  </div>
                  <div className="text-gray-400 text-xs">
                    ファイルサイズ：2MBまで
                  </div>
                </button>
              )}

              {imageList.map((image, index) => (
                <div key={index}>
                  {image.dataURL && (
                    <div className="relative">
                      <Image
                        src={image.dataURL}
                        alt="image"
                        width={768}
                        height={432}
                        priority={true}
                      />

                {/* 画像削除ボタン */}
                <button
                  onClick={() => onImageRemove(index)}
                  className="absolute top-0 right-0 bg-black text-white p-2 rounded-full"
                >
                  ✕
                </button>
                    </div>
                  )}
                </div>
              ))}

              {imageList.length > 0 && (
                <div className="text-center mt-3">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();//大元の動作を妨げる
                      onImageUpdate(0);//クリックで画像アップロード
                    }}
                  >
                    画像を変更
                  </Button>
                </div>
              )}
            </div>
          )}
        </ImageUploading>

          <div className="space-y-4 w-full">
            <FormError message={error} />
            <Button
              type="submit"
              className="w-full space-x-2 font-bold"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>送信</span>
            </Button>
          </div>
        </form>
      </Form>    
      </div>
    </div>
  )
}

export default NewRenraku;