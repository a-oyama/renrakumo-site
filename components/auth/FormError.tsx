// フォームのエラーメッセージ

import { AlertCircle } from "lucide-react"

interface FormErrorProps {
  message?: string
}

// エラーメッセージない場合はnullをmessageに格納
const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null

  // エラーメッセージの決まりCSSと！アイコン
  return (
    <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <div>{message}</div>
    </div>
  )
}

export default FormError;
