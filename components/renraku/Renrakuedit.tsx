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
import { RenrakuSchema } from "@/schemas"
import { editRenraku } from "@/actions/renraku"
import { useRouter } from "next/navigation"
import { RenrakuType } from "@/types"
import ImageUploading, { ImageListType } from "react-images-uploading"
import toast from "react-hot-toast"
import Image from "next/image"
import FormError from "@/components/auth/FormError"


interface RenrakuEditProps {
  renraku: RenrakuType
}

const RenrakuEdit = ({ renraku }: RenrakuEditProps) => {

  const router = useRouter()
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  // 画像の状態確認(ある or ない)
  const [imageUpload, setImageUpload] = useState<ImageListType>([
    {
      dataURL: renraku.image_url || "/noImage.png",
    },
  ])

  const form = useForm<z.infer<typeof RenrakuSchema>>({
    resolver: zodResolver(RenrakuSchema),
    defaultValues: {
      title: renraku.title,
      content: renraku.content,
    },
  })

  // 送信処理
  const onSubmit = (values: z.infer<typeof RenrakuSchema>) => {
    setError("")
  
    let base64Image: string | undefined
  
    // 画像が存在している場合，64データを準備
    // 1.画像がアップロードされていなければスキップ
    // 2.画像URLがない場合はスキップ
    // 3.64形式に変換されているか
    
    startTransition(async () => {
      try {

        if (
          imageUpload.length > 0 && 
          imageUpload[0].dataURL && 
          imageUpload[0].dataURL.startsWith("data:image")
        ) {
          const image = imageUpload[0]
          base64Image = image.dataURL
        }
  
        // 画像がある場合は右端処理・ない場合は2番目までの""
        const imageUrl = base64Image ? "" :
        imageUpload.length === 0 ? "" : renraku.image_url

        const res = await editRenraku({
          ...values,
          blogId: renraku.id,
          imageUrl: imageUrl,
          base64Image,
          userId: renraku.user_id,
        })
  
        if (res?.error) {
          setError(res.error)
          return
        }
  
        toast.success("記事を編集しました")
        router.push(`/renraku/${renraku.id}`)
        router.refresh()
      } catch (error) {
        console.error(error)
        setError("エラーが発生しました")
      }
    })
  }

  // 画像アップロード
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

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="font-bold text-xl text-center mb-10">記事を編集</div>

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

<div className="mb-5">
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
          <div key={index} className="relative">
            {image.dataURL && (
              <div>
                <Image
                  src={image.dataURL}
                  alt="image"
                  width={768}
                  height={432}
                  priority={true}
                />
                {/* 画像削除ボタン */}
                <button
                  /* onClick={() => onImageRemove(index)} */
                  onClick={() => {
                    onImageRemove(index)
                    setImageUpload([])
                  }}
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
                e.preventDefault();
                onImageUpdate(0);
              }}
            >
              添付画像
            </Button>
          </div>
        )}
      </div>
    )}
  </ImageUploading>
</div>

          <div className="space-y-4 w-full">
            <FormError message={error} />

            <Button
              type="submit"
              className="w-full space-x-2 font-bold"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>編集</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default RenrakuEdit;
