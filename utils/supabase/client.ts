// supabaseアクセス設定(クライアントで使用するために宣言)

import { createBrowserClient } from '@supabase/ssr'

// 初期化の設定
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}