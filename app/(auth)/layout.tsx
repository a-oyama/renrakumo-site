// サインアップ・ログインページに共通レイアウト適用
// childrenで各ページ挿入

interface AuthLayoutProps {
    children: React.ReactNode
  }
  
  const AuthLayout = async ({ children }: AuthLayoutProps) => {
    return (
      <div className="flex items-center justify-center mt-20">{children}</div>
    )
  }
  
  export default AuthLayout;