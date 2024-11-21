// データが存在しないときの画面(404 Not Found)

"use client"//画面表示

const NotFound = () => {
  return (
    <div>
      <div className="text-center text-5xl font-bold mb-3">404</div>
      <div className="text-center text-xl font-bold">Not Found</div>
    </div>
  )
}

export default NotFound;