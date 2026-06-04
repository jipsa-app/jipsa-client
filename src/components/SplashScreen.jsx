import { useState, useEffect } from 'react'

export default function SplashScreen({ onDone }) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1500)
    const doneTimer = setTimeout(() => onDone(), 2000)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-mobile h-full z-[100] bg-[#185FA5] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ opacity: fadeOut ? 0 : 1, pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
      {/* 로고 */}
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl text-5xl">
          🏠
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">집사</h1>
          <p className="text-white/70 text-sm mt-1">처음 집 구하는 분들을 위한 가이드</p>
        </div>
      </div>

      {/* 하단 로딩 점 */}
      <div className="absolute bottom-16 flex gap-2">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      </div>
    </div>
  )
}
