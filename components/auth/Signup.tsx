"use client"

import { useState, useTransition } from "react"
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
import { ChevronRight, Loader2, EyeOffIcon, EyeIcon } from "lucide-react"
import { SignupSchema } from "@/schemas"
// アニメーションでメッセージ
import { z } from "zod"
import { signup } from "@/actions/auth"
// ページ遷移
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import FormError from "./FormError"
import Link from "next/link"

// アカウント登録
const Signup = () => {

  const router = useRouter()
  const [error, setError] = useState("")
  // 画面表示を変えず，裏でレンダリング処理し，終わったら画面切替
  const [isPending, startTransition] = useTransition()
  // パスワードの非表示化
  const [passwordVisibility, setPasswordVisibility] = useState(false)

  // フォームの初期値を設定
  const form = useForm<z.infer<typeof SignupSchema>>({
    
    // サインアップスキーマでルール＆メッセージを別設定
    resolver: zodResolver(SignupSchema),
    // ↓初期値を規定し，useFormにする
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // onSubmit=>送信
  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    setError("")

    startTransition(async () => {
      try {
        const res = await signup({
          ...values,
        })

        if (res?.error) {
          setError(res.error)
          return
        }

        toast.success("アカウントを登録しました")
        router.push("/signup/success")
        router.refresh()
      } catch (error) {
        console.error(error)
        setError("アカウント登録に失敗しました")
      }
    })
  }

  return (
    <div className="w-[500px] p-5 rounded-xl border">
      <div className="text-primary text-xl font-bold text-center border-b border-black pb-5 mb-5 mt-3">
        アカウント登録
      </div>

{/* onsubmit=> FormデータをDB送信 */}
{/* isPending & Loaderで時間稼ぎ */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">お名前</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">メールアドレス</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">パスワード</FormLabel>
                <FormControl>
                  <div className="relative">
                    {/* パスワード表示切替 */}
                    <Input
                      type={passwordVisibility ? "text" : "password"}
                      placeholder=""
                      {...field}
                      disabled={isPending}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                      onClick={() => setPasswordVisibility(!passwordVisibility)}
                    >
                      {passwordVisibility ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 w-full">
            <FormError message={error} />
            <Button
              type="submit"
              className="w-full space-x-2 font-bold"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>新規登録</span>
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center mt-5 space-y-2">
        <div>
          <Link href="/login" className="text-sm text-primary font-bold">
            既にアカウントをお持ちの方はこちら{" "}
            <ChevronRight className="w-4 h-4 inline align-text-bottom" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup;
